# Overview
This is the content bundle for the Entando Customer Portal. It contains the "non-code" parts of the Customer Portal including basic setup for a few pages

# Deployment and installation

With this configuration, you can use the ent cli (https://dev.entando.org/next/docs/reference/entando-cli.html) to perform the full deployment sequence:

### Set up the project directory.

1. Prepare the bundle directory: `./buildBundle.sh`
2. Initialize the project: `ent prj init`
3. Initialize publication: `ent prj pbs-init` (requires the git bundle repo url)

### Publish the bundle.

1. Build: `./buildBundle.sh` (set up the bundle from bundle_src)
2. Publish: `ent prj fe-push` (publish the bundle)
3. Deploy (after connecting to k8s): `ent prj deploy`
4. Install the bundle via 1) App Builder, 2) `ent prj install`, or 3) `ent prj install --conflict-strategy=OVERRIDE` on subsequent installs.
5. Iterate steps 1-4 to publish new versions.
