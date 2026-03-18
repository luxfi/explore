import json, sys, base64
result_file = sys.argv[1]
output_file = sys.argv[2]
with open(result_file) as f:
    d = json.load(f)
with open(output_file, 'wb') as f:
    f.write(base64.b64decode(d['base64']))
print(f"saved: {output_file}")
