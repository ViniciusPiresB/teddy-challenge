terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = "us-west-1"
  access_key = "var.aws_access_key_id"
  secret_key = var.aws_secret_access_key
}

# Para gerar a chave privada SSH
resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "key_name" {
  description = "Nome do par de chaves SSH"
}

# Criar o par de chaves para conectar a instância EC2 via SSH
resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

# Salvar o arquivo PEM localmente
resource "local_file" "private_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = var.key_name

  provisioner "local-exec" {
    command = "chmod 400 ${var.key_name}"
  }
}

# Criando o grupo de segurança para a instância EC2
resource "aws_security_group" "sg_ec2" {
  name        = "sg_ec2"
  description = "Grupo de segurança para EC2 com PostgreSQL e aplicação Node.js"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Criando a instância EC2
resource "aws_instance" "public_instance" {
  ami                    = "ami-0f5ee92e2d63afc18"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [aws_security_group.sg_ec2.id]

  tags = {
    Name = "public_instance"
  }

  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  # Provisionamento da instância
  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install postgresql postgresql-contrib -y",
      "sudo systemctl start postgresql",
      "sudo systemctl enable postgresql",
      "sudo -u postgres psql -c \"CREATE DATABASE teddy_challenge;\"",
      "sudo -u postgres psql -c \"CREATE USER postgres WITH PASSWORD 'root';\"",
      "sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE teddy_challenge TO postgres;\"",
      "cd /home/ubuntu",
      "git clone https://github.com/ViniciusPiresB/teddy-challenge.git app",
      "cd app",
      "sudo apt-get install -y nodejs npm",
      "npm install",
      "echo \"DATABASE_URL=postgresql://postgres:root@localhost:5432/teddy_challenge\" > .env",
      "nohup npm start &"
    ]

    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = tls_private_key.rsa_4096.private_key_pem
    }
  }
}

# Output do IP público da instância EC2
output "instance_ip" {
  value = aws_instance.public_instance.public_ip
}
