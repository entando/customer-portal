INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.ticketingSystem-form.js
mv -f main*.js main.ticketingSystem-form.js
mv -f runtime~main*.js runtime.ticketingSystem-form.js

popd

serve -l 5001 build
