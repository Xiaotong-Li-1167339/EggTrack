from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db_connection
import json

eggs_bp = Blueprint('eggs', __name__)

@eggs_bp.route('/record', methods=['POST'])
@jwt_required()
def record_eggs():
    current_user = json.loads(get_jwt_identity())
    if current_user['role'] not in ['admin', 'operator']:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    record_date = data.get('record_date')
    quantity = data.get('quantity')
    flock_size = data.get('flock_size')
    grade = data.get('grade')
    notes = data.get('notes', '')

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO egg_records (operator_id, record_date, quantity, flock_size, grade, notes) VALUES (%s, %s, %s, %s, %s, %s)",
            (current_user['id'], record_date, quantity, flock_size, grade, notes)
        )
        cur.execute(
            "INSERT INTO inventory (grade, available_qty) VALUES (%s, %s) ON CONFLICT (grade) DO UPDATE SET available_qty = inventory.available_qty + %s, updated_at = CURRENT_TIMESTAMP",
            (grade, quantity, quantity)
        )
        conn.commit()
        return jsonify({'message': 'Egg record added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

@eggs_bp.route('/records', methods=['GET'])
@jwt_required()
def get_records():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.id, u.username, e.record_date, e.quantity, e.flock_size, e.grade, e.notes
        FROM egg_records e
        JOIN users u ON e.operator_id = u.id
        ORDER BY e.record_date DESC
    """)
    records = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{
        'id': r[0],
        'operator': r[1],
        'record_date': str(r[2]),
        'quantity': r[3],
        'flock_size': r[4],
        'grade': r[5],
        'notes': r[6]
    } for r in records]), 200