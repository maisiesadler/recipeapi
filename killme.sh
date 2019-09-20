npm install -g typescript
tsc --p tsconfig.json
npm install
node compiled/main.js 2>&1 > /dev/stdout &

runme() {
    echo killing

    nodepid=$(pgrep node)
    kill -15 $nodepid
    wait $nodepid

    exit $?
}

trap runme SIGTERM
while true; do
   sleep 1
done