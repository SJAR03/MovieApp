FROM mysql:8.0

# Instalar herramientas adicionales
RUN apt-get update && apt-get install -y net-tools mysql-client

COPY mysqld.cnf /etc/mysql/conf.d/mysqld.cnf