---
sidebar_position: 5
---

# Versioning
Every service in the platform has its own version. Consult each service's documentation to see which platform version it's compatible with.
All versions should follow the [semantic versioning paradigm](https://semver.org/).

When specifying the requirements in your project, the recommended way is to specify explicit versions, for example `==1.5.2`.
You could also specify it as `~=1.5.2` (which is equal to `>=1.5.2,<1.6`), or `==1.5.*`, but you're taking a risk there.

If you encounter a bug when upgrading to a compatible version, please let us know.

## Pre-releases
We release alpha and beta versions before every new major release, e.g. 4.0.0a0 (this means 4.0.0 doesn't exist yet).
Keep in mind that these are experimental releases, and _no backwards-compatibility is guaranteed between such versions_.
