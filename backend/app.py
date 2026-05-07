from flask import Flask
from config import Config
from routes.auth import auth_bp
from routes.eggs import eggs_bp
from routes.inventory import inventory_bp
from routes.orders import orders_bp
from routes.chat import chat_bp

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(eggs_bp, url_prefix='/api/eggs')
app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

if __name__ == '__main__':
    app.run(debug=True)