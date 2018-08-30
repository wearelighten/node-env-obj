# node-env-obj
Compiles environment vars into a predefined accessible object structure.

# What's New

### Version: 0.1.1
- FIX: package.json not referencing correct main file
- FIX: Use process.cwd instead of __dirname so path is relative to project not the module
- ADDED: package-lock & .gitignore

### 0.1.0
- ADDED: Load *.env files from specific path into process.env
- ADDED: Parsing and replace keys in config.json with process.env values