FROM python:3.10.7-slim

# Sets working directory
WORKDIR /assistant

# Copies files and install dependencies
COPY . /assistant
RUN pip install --no-cache-dir -r requirements.txt

# Default command
CMD ["python", "document_store.py"]