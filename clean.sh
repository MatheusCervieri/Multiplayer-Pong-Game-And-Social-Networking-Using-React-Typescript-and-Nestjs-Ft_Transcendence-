docker system prune --all --force --volumes
docker network prune --force
docker volume prune --force
sudo rm -rf ~/data/wordpress/*
sudo rm -rf ~/data/mariadb/*
sudo docker stop $(docker ps -qa); 
sudo docker rm $(docker ps -qa); 
sudo docker rmi -f $(docker images -qa); 
sudo docker volume rm $(docker volume ls -q); 
sudo docker network rm $(docker network ls -q) 2>/dev/null