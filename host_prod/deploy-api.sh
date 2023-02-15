# sudo microk8s kubectl delete -f showtime-api-deployment.yaml;
# sudo microk8s kubectl apply -f showtime-api-deployment.yaml;
git pull
#bin/bash
file="api/todolist-kotlin-backend-deployment.yml"
oldstr=`grep  'my' $file | xargs`
timestamp="$(date +"%Y-%m-%d-%H:%M:%S")"
newstr="value: my-version-$timestamp"
sed -i "s/$oldstr/$newstr/g" $file
echo "old version : $oldstr"
echo "Replaced String :  $newstr"

# sudo microk8s kubectl -n showtime-application patch deployment/api-deployment\
#   -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"date\":\"`date +'%s'`\"}}}}}"

echo "launching new deployment"
n=0
until [ "$n" -ge 5 ]
do
   sudo microk8s kubectl apply -f $file && break  # substitute your command here
   n=$((n+1)) 
   sleep 5
done
echo "push new version to git"
 git add .
 git commit -m "deployment -- PROD --  version API : $timestamp"
 git push
while [ "$(sudo microk8s kubectl get pods -l app=kotlin-back -n todolist-application | grep -w "backend-deployment" | wc -l)" != "1" ]; do
   sleep 5
   echo "Waiting for new api deployment to be ready..."
done
echo "Rolling update fully complete"

# sudo microk8s kubectl rollout status deployment/api-deployment -n showtime-application