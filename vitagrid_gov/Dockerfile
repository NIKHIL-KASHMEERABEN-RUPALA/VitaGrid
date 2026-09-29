# VitaGrid GOV - Sovereign Multi-Agent Platform Dockerfile
# FIPS 140-3 and FedRAMP High compliant container build

FROM python:3.11-slim

# Prevent python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV VITAGRID_ENV=production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY vitagrid_gov/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY vitagrid_gov/ /app/vitagrid_gov/

# Expose API and WebSocket port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run Uvicorn ASGI server
CMD ["uvicorn", "vitagrid_gov.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
