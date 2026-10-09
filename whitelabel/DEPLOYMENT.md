# Publicação

URL: https://changeskills.app/whitelabel/

Serviço: changeskills-whitelabel
Diretório: /www/wwwroot/changeskills-whitelabel
Backend: 127.0.0.1:3027, Node 24
Persistência: data/database.json e uploads em data; não sobrescrever em atualizações.
E-mail: SMTP fornecido pelo EnvironmentFile do serviço Change Skills.
Frontend usa /whitelabel/api; Nginx encaminha apenas /whitelabel/ ao backend próprio.
