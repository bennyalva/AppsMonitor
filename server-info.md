////////
user centos::::
userName: deploy
password: deploy100
/////////
user jenquins:::
url : http://10.11.5.213:8080
userNAme: admin-monitoring
password: admin100
///////
server ssh centos7:::
IP: 10.27.24.38
Usr: root
Pwd: //Fap05
///////traefik
https://www.digitalocean.com/community/tutorials/how-to-use-traefik-as-a-reverse-proxy-for-docker-containers-on-centos-7

/////begin mageddo
http://mageddo.github.io/dns-proxy-server/latest/en/2-features/installing-as-service/

start docker service:::::::::::///////
docker run --hostname dns.mageddo --name dns-proxy-server -p 5380:5380 \
  --restart=unless-stopped -d \
  -v /opt/dns-proxy-server/conf:/app/conf \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc/resolv.conf:/etc/resolv.conf \
  defreitas/dns-proxy-server

/////end mageddo


