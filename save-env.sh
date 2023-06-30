#!/bin/sh

# Parse command-line arguments
while [ $# -gt 0 ]; do
  key="$1"

  case $key in
    --vault)
      vault="$2"
      shift # past argument
      shift # past value
      ;;
    --item-name)
      item_name="$2"
      shift # past argument
      shift # past value
      ;;
    --env-file)
      env_file="$2"
      shift # past argument
      shift # past value
      ;;
    *)
      # unknown option
      shift
      ;;
  esac
done

# Check if the --vault, --item-name, and --env-file parameters were provided
if [ -z "$vault" ] || [ -z "$item_name" ] || [ -z "$env_file" ]; then
  echo "Please provide --vault, --item-name, and --env-file parameters."
  exit 1
fi

# Check if the specified .env file exists
if [ ! -f "$env_file" ]; then
  echo "The specified .env file does not exist."
  exit 1
fi

# Check if the 1Password CLI is installed
if ! command -v op > /dev/null 2>&1; then
  echo "1Password CLI is not installed. Please install it before running this script."
  exit 1
fi

# Check if the item already exists in the vault
if op item get "$item_name" --vault "$vault" > /dev/null 2>&1; then
  echo "Item '$item_name' already exists in the '$vault' vault. Skipping creation."
  exit 0
fi

# Variable to store the fields string
fields=()
skipped_fields=()

# Read the .env file line by line
while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  if [ -z "$line" ] || [ "${line#"#"}" != "$line" ]; then
    continue
  fi

  # Split the line into key and value
  key="${line%%=*}"
  value="${line#*=}"

  # Check if the value is already a reference to a 1Password secret
  if [ "${value#op://}" != "$value" ]; then
    echo "Skipping creation of '$key' field as it is already a reference to a 1Password secret."
    skipped_fields+=($line)
    continue
  fi

  # Add the key-value pair to the fields array
  fields+=("$key=$value")
done < "$env_file"

# Create the item in 1Password using the op create command
op item create \
  --category Server \
  --title "$item_name" \
  --vault "$vault" \
  "${fields[@]}" \
  --tags "$item_name,env"

# Update the .env file with the secret references
for ((i = 0; i < ${#fields[@]}; i++)); do
  # Split the field into key and value
  field="${fields[i]}"
  IFS="=" read -r key value <<< "$field"

  fields[i]="$key=op://$vault/$item_name/$key"
done

final_fields=("${fields[@]}" "${skipped_fields[@]}")

# Overwrite the .env file with the updated key-value pairs
printf "%s\n" "${final_fields[@]}" > "$env_file"

echo "Item '$item_name' created successfully in the '$vault' vault."
echo "Updated the '$env_file' file with the secret references."