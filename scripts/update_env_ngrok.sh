#!/bin/bash

# Yêu cầu người dùng nhập URL ngrok
read -p "Nhập URL ngrok: " NGROK_URL

# Kiểm tra xem URL có được nhập hay không
if [ -z "$NGROK_URL" ]; then
    echo "Vui lòng nhập vào URL ngrok."
    exit 1
fi

echo "Ngrok URL: $NGROK_URL"

# Đường dẫn đến thư mục apps và file .env ở root
APPS_DIR="apps"
ROOT_ENV_FILE=".env"

# Kiểm tra xem thư mục apps có tồn tại không
if [ ! -d "$APPS_DIR" ]; then
    echo "Thư mục $APPS_DIR không tồn tại."
    exit 1
fi

# Danh sách các biến môi trường cần cập nhật
declare -A ENV_VARS
ENV_VARS=(
    ["KINDE_SITE_URL"]="$NGROK_URL"
    ["KINDE_POST_LOGOUT_REDIRECT_URL"]="$NGROK_URL"
    ["KINDE_POST_LOGIN_REDIRECT_URL"]="$NGROK_URL/auth-callback"
    ["NEXT_PUBLIC_SERVER_URL"]="$NGROK_URL"
    ["UPLOADTHING_URL"]="$NGROK_URL"
    ["ZLP_MERCHANT_CALLBACK_URL"]="$NGROK_URL"
)

# Cập nhật file .env ở root
if [ -f "$ROOT_ENV_FILE" ]; then
    echo "Cập nhật $ROOT_ENV_FILE..."
    for VAR in "${!ENV_VARS[@]}"; do
        if grep -q "^$VAR=" "$ROOT_ENV_FILE"; then
            sed -i "s|^$VAR=.*|$VAR=${ENV_VARS[$VAR]}|g" "$ROOT_ENV_FILE"
        fi
    done
else
    echo "File $ROOT_ENV_FILE không tồn tại."
fi

# Lặp qua các thư mục con trong apps
for COMPONENT_DIR in "$APPS_DIR"/*; do
    if [ -d "$COMPONENT_DIR" ]; then
        ENV_FILE_AUTH="$COMPONENT_DIR/.env.local"
        ENV_FILE_PAYMENT="$COMPONENT_DIR/.env"

        # Cập nhật file .env.local
        if [ -f "$ENV_FILE_AUTH" ]; then
            echo "Cập nhật $ENV_FILE_AUTH..."
            for VAR in "${!ENV_VARS[@]}"; do
                if grep -q "^$VAR=" "$ENV_FILE_AUTH"; then
                    sed -i "s|^$VAR=.*|$VAR=${ENV_VARS[$VAR]}|g" "$ENV_FILE_AUTH"
                fi
            done
        fi

        # Cập nhật file .env
        if [ -f "$ENV_FILE_PAYMENT" ]; then
            echo "Cập nhật $ENV_FILE_PAYMENT..."
            for VAR in "${!ENV_VARS[@]}"; do
                if grep -q "^$VAR=" "$ENV_FILE_PAYMENT"; then
                    sed -i "s|^$VAR=.*|$VAR=${ENV_VARS[$VAR]}|g" "$ENV_FILE_PAYMENT"
                fi
            done
        fi
    fi
done

echo "Các URL đã được cập nhật trong tất cả các file .env và .env.local."
