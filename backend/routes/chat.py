from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db_connection
from config import Config
import anthropic

chat_bp = Blueprint('chat', __name__)

client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """You are EggTrack's helpful assistant for a poultry farm in New Zealand. 
You help with two things:
1. Customer service: answering questions about egg grades, pricing, ordering, and delivery.
2. Staff training: explaining farm operations, egg grading procedures, and daily workflows for new employees.

Keep responses concise and friendly. If asked about specific order details or account information, 
ask the user to log in first."""

@chat_bp.route('/message', methods=['POST'])
def send_message():
    data = request.get_json()
    user_message = data.get('message')
    conversation_history = data.get('history', [])

    conversation_history.append({
        'role': 'user',
        'content': user_message
    })

    response = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        messages=conversation_history
    )

    assistant_message = response.content[0].text

    conversation_history.append({
        'role': 'assistant',
        'content': assistant_message
    })

    return jsonify({
        'message': assistant_message,
        'history': conversation_history
    }), 200