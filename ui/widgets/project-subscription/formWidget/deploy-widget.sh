INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.projectSubscription-form.js
mv -f main*.js main.projectSubscription-form.js
mv -f runtime~main*.js runtime.projectSubscription-form.js

popd

serve -l 5001 build
