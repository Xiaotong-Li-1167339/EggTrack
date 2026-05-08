from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db_connection
import json

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    current_user = json.loads(get_jwt_identity())
    if current_user['role'] != 'buyer':
        return jsonify({'error': 'Only buyers can place orders'}), 403

    data = request.get_json()
    items = data.get('items')

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO orders (buyer_id) VALUES (%s) RETURNING id",
            (current_user['id'],)
        )
        order_id = cur.fetchone()[0]

        for item in items:
            grade = item.get('grade')
            quantity = item.get('quantity')
            unit_price = item.get('unit_price')

            cur.execute(
                "SELECT available_qty FROM inventory WHERE grade = %s",
                (grade,)
            )
            inventory = cur.fetchone()
            if not inventory or inventory[0] < quantity:
                conn.rollback()
                return jsonify({'error': f'Insufficient stock for {grade}'}), 400

            cur.execute(
                "INSERT INTO order_items (order_id, grade, quantity, unit_price) VALUES (%s, %s, %s, %s)",
                (order_id, grade, quantity, unit_price)
            )
            cur.execute(
                "UPDATE inventory SET available_qty = available_qty - %s, updated_at = CURRENT_TIMESTAMP WHERE grade = %s",
                (quantity, grade)
            )

        conn.commit()
        return jsonify({'message': 'Order created successfully', 'order_id': order_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    current_user = get_jwt_identity()
    conn = get_db_connection()
    cur = conn.cursor()

    if current_user['role'] == 'buyer':
        cur.execute("""
            SELECT o.id, o.status, o.created_at,
                   oi.grade, oi.quantity, oi.unit_price
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.buyer_id = %s
            ORDER BY o.created_at DESC
        """, (current_user['id'],))
    else:
        cur.execute("""
            SELECT o.id, o.status, o.created_at,
                   oi.grade, oi.quantity, oi.unit_price
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            ORDER BY o.created_at DESC
        """)

    orders = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{
        'order_id': o[0],
        'status': o[1],
        'created_at': str(o[2]),
        'grade': o[3],
        'quantity': o[4],
        'unit_price': float(o[5])
    } for o in orders]), 200