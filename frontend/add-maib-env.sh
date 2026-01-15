#!/bin/bash

# Script pentru adăugarea configurației MAIB în .env

ENV_FILE="frontend/.env"

# Verifică dacă fișierul .env există
if [ ! -f "$ENV_FILE" ]; then
    echo "Fișierul .env nu există. Se creează..."
    touch "$ENV_FILE"
fi

# Verifică dacă există deja configurație MAIB
if grep -q "VITE_MAIB_PROJECT_ID" "$ENV_FILE"; then
    echo "Configurația MAIB există deja în .env"
    echo "Dorești să o suprascrii? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "Operațiune anulată."
        exit 0
    fi
    # Șterge configurația veche
    sed -i.bak '/^# MAIB eCommerce Configuration/,/^VITE_MAIB_TEST_MODE=/d' "$ENV_FILE"
fi

# Adaugă configurația MAIB
cat >> "$ENV_FILE" << 'EOF'

# MAIB eCommerce Configuration
# Datele de TEST furnizate de MAIB
VITE_MAIB_PROJECT_ID=9B9C19AE-DC32-4128-9249-16412CCD7E6B
VITE_MAIB_PROJECT_SECRET=efb8506c-0afb-4430-8e33-5b0336a18ccf
VITE_MAIB_SIGNATURE_KEY=4fa8f893-7f39-4f13-b5c2-34e6629b84dc
VITE_MAIB_API_URL=https://api.maibmerchants.md
VITE_MAIB_API_ENDPOINT=/api/v1/payment/session
VITE_MAIB_TEST_MODE=true
EOF

echo "✅ Configurația MAIB a fost adăugată în .env"
echo ""
echo "Verifică conținutul fișierului:"
echo "cat $ENV_FILE | grep MAIB"
