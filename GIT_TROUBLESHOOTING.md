# Git Troubleshooting - Eroare Push

## Problema: HTTP 400 la Push

Eroarea `RPC failed; HTTP 400` apare de obicei când:
1. Fișiere prea mari în commit
2. Buffer Git prea mic
3. Probleme de rețea

## Soluții Aplicate

### 1. Mărire Buffer Git

Am mărit buffer-ul Git la 500MB:
```bash
git config http.postBuffer 524288000
```

### 2. Verificare Fișiere Mari

Commit-ul curent conține fișiere mari:
- `frontend/src/assets/primul.png` (~1.4 MB)
- Alte imagini JPG

## Soluții Recomandate

### Opțiunea 1: Push cu Buffer Mărit (Deja aplicat)

```bash
# Buffer-ul este deja mărit, încearcă din nou:
git push origin main
```

### Opțiunea 2: Git LFS pentru Fișiere Mari

Dacă trebuie să păstrezi fișierele mari în Git:

```bash
# Instalează Git LFS
brew install git-lfs  # macOS
# sau
apt-get install git-lfs  # Linux

# Inițializează Git LFS
git lfs install

# Track fișiere mari
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.jpeg"
git lfs track "*.gif"

# Adaugă .gitattributes
git add .gitattributes

# Reface commit-ul cu LFS
git add frontend/src/assets/*.png
git add frontend/src/assets/*.jpg
git commit --amend
git push origin main
```

### Opțiunea 3: Ignoră Fișierele Mari și Folosește CDN

1. Adaugă în `.gitignore`:
```gitignore
# Large assets - use CDN instead
frontend/src/assets/*.jpg
frontend/src/assets/*.png
frontend/src/assets/*.jpeg
```

2. Mută imaginile pe un CDN (Cloudinary, AWS S3, etc.)
3. Actualizează referințele în cod

### Opțiunea 4: Push Incremental

Dacă buffer-ul mărit nu funcționează:

```bash
# Push fără fișiere mari
git push origin main --no-verify

# Sau folosește SSH în loc de HTTPS
git remote set-url origin git@github.com:username/repo.git
git push origin main
```

## Verificare Configurare

```bash
# Verifică buffer-ul
git config --get http.postBuffer

# Verifică remote URL
git remote -v

# Verifică fișiere mari în commit
git show --stat HEAD | grep -i "Bin"
```

## Prevenire Viitoare

1. **Folosește Git LFS** pentru fișiere > 1MB
2. **Folosește CDN** pentru imagini și assets
3. **Verifică înainte de commit:**
   ```bash
   find . -type f -size +1M -not -path "./.git/*" -not -path "./node_modules/*"
   ```

## Dacă Problema Persistă

1. Verifică conexiunea la internet
2. Încearcă push pe altă rețea
3. Contactează administratorul repository-ului
4. Folosește SSH în loc de HTTPS

