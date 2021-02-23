INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.projectSubscription-table.js
mv -f main*.js main.projectSubscription-table.js
mv -f runtime~main*.js runtime.projectSubscription-table.js

popd

serve -l 5002 build
