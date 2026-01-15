# Cum să Pornești Backend-ul

## Problema: uvicorn nu este găsit

Dacă primești eroarea `zsh: command not found: uvicorn`, urmează acești pași:

## Soluție 1: Instalează uvicorn

```bash
cd backend
pip install uvicorn
```

## Soluție 2: Folosește python -m uvicorn

Dacă uvicorn este instalat dar nu este în PATH:

```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## Soluție 3: Instalează toate dependențele

```bash
cd backend
pip install -r requirements.txt
```

Apoi pornește serverul:
```bash
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## Verificare

După ce pornești serverul, ar trebui să vezi:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Și la încărcare, vei vedea logurile MAIB:

```
🔧 MAIB Configuration Loaded:
   Project ID: 9B9C19AE-DC32-4128-9249-16412CCD7E6B
   ...
```

## Testare

Deschide în browser sau curl:
```bash
curl http://localhost:8000/api/
```

Ar trebui să primești: `{"message":"Hello World"}`

## Dacă ai probleme cu pip

Dacă ai erori de permisiuni cu pip, încearcă:

```bash
pip install --user uvicorn
```

Sau folosește conda (dacă folosești conda):
```bash
conda install -c conda-forge uvicorn
```
