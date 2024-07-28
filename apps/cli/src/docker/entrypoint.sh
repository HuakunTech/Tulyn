cd /workspace
rm *.tgz
cp -r /workspace /workspace-copy
cd /workspace-copy
npm i
npm run build
npm pack
# check number of *.tgz file in current directory
# if more than 1, then exit with error
if [ $(ls -1 *.tgz 2>/dev/null | wc -l) -gt 1 ]; then
    echo "More than one tgz file found"
    exit 1
fi
cp *.tgz /workspace
