# Copy package.json and dist folder to dev-extension folder for development

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
for dir in $(ls $DIR); do
    if [ -d $DIR/$dir ]; then
        echo "Copying $DIR/$dir to ../../dev/extensions/$dir"
        rm -rf $DIR/../../dev/extensions/$dir
        mkdir -p $DIR/../../dev/extensions/$dir
        cp -r $DIR/$dir/dist $DIR/../../dev/extensions/$dir/dist
        cp $DIR/$dir/package.json $DIR/../../dev/extensions/$dir/package.json
    fi
done
