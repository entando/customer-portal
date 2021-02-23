INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.partner-table.js
mv -f main*.js main.partner-table.js
mv -f runtime~main*.js runtime.partner-table.js

popd

serve -l 5002 build
