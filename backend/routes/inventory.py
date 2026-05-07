from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import get_db_connection

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT grade, available_qty, updated_at FROM inventory")
    items = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{
        'grade': item[0],
        'available_qty': item[1],
        'updated_at': str(item[2])
    } for item in items]), 200