#!/bin/bash

################################################################################
# Add State Tax Data Script
#
# This script automates the process of adding state income tax data for a 
# specified year by using the GitHub Copilot CLI to research and create 
# TypeScript files for all 50 US states and Washington DC.
#
# The script processes states in batches of 5, automatically skipping any 
# states that already have data files for the specified year.
#
# Usage:
#   ./scripts/add-remaining-states.sh [-y YEAR]
#
# Options:
#   -y YEAR    Specify the tax year (e.g., 2025). If not provided, you will
#              be prompted to enter it.
#
# Examples:
#   # Interactive mode (prompts for year)
#   ./scripts/add-remaining-states.sh
#
#   # With year specified
#   ./scripts/add-remaining-states.sh -y 2025
#
# Requirements:
#   - GitHub Copilot CLI must be installed and authenticated
#   - Node.js and npm must be installed (for validation script)
#
# The script will:
#   1. Check for existing state files in src/data/{YEAR}/state/
#   2. Research tax data for states that are missing
#   3. Create TypeScript files following the project conventions
#   4. Validate the created files using npm run validate-tax-data
#   5. Pause between batches for review
#
################################################################################

# Parse command line arguments
YEAR=""
while getopts "y:" opt; do
  case $opt in
    y) YEAR="$OPTARG" ;;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
  esac
done

# Prompt for year if not provided
if [ -z "$YEAR" ]; then
  read -p "Enter the year to add state data for (e.g., 2025): " YEAR
fi

# Validate year
if ! [[ "$YEAR" =~ ^[0-9]{4}$ ]]; then
  echo "Error: Invalid year format. Please enter a 4-digit year."
  exit 1
fi

echo "Processing state data for year: $YEAR"
echo ""

# Create log file with timestamp
LOG_FILE="logs/add-states-${YEAR}-$(date +%Y%m%d-%H%M%S).log"
mkdir -p logs

echo "State Tax Data Addition - Year: $YEAR" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Complete list of all 50 states + DC (alphabetically)
states=(
  "Alabama"
  "Alaska"
  "Arizona"
  "Arkansas"
  "California"
  "Colorado"
  "Connecticut"
  "Delaware"
  "Florida"
  "Georgia"
  "Hawaii"
  "Idaho"
  "Illinois"
  "Indiana"
  "Iowa"
  "Kansas"
  "Kentucky"
  "Louisiana"
  "Maine"
  "Maryland"
  "Massachusetts"
  "Michigan"
  "Minnesota"
  "Mississippi"
  "Missouri"
  "Montana"
  "Nebraska"
  "Nevada"
  "New Hampshire"
  "New Jersey"
  "New Mexico"
  "New York"
  "North Carolina"
  "North Dakota"
  "Ohio"
  "Oklahoma"
  "Oregon"
  "Pennsylvania"
  "Rhode Island"
  "South Carolina"
  "South Dakota"
  "Tennessee"
  "Texas"
  "Utah"
  "Vermont"
  "Virginia"
  "Washington"
  "West Virginia"
  "Wisconsin"
  "Wyoming"
  "District of Columbia"
)

# Filter out states that already exist
missing_states=()
for state in "${states[@]}"; do
  # Convert to snake_case filename
  filename=$(echo "$state" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
  filepath="src/data/${YEAR}/state/${filename}.ts"
  
  if [ -f "$filepath" ]; then
    echo "  ✓ $state: ALREADY EXISTS (skipping)" | tee -a "$LOG_FILE"
  else
    missing_states+=("$state")
  fi
done
echo "" | tee -a "$LOG_FILE"

total_missing=${#missing_states[@]}

if [ $total_missing -eq 0 ]; then
  echo "All states already have data files. Nothing to add." | tee -a "$LOG_FILE"
  echo "Completed: $(date)" | tee -a "$LOG_FILE"
  echo "Log file saved to: $LOG_FILE"
  exit 0
fi

echo "Found $total_missing state(s) that need data files." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Process missing states in batches of 5
batch_size=5
batch_num=0

for ((i=0; i<$total_missing; i+=batch_size)); do
  batch=("${missing_states[@]:i:batch_size}")
  batch_num=$((batch_num + 1))
  
  echo "==========================================" | tee -a "$LOG_FILE"
  echo "Processing Batch $batch_num: ${batch[*]}" | tee -a "$LOG_FILE"
  echo "==========================================" | tee -a "$LOG_FILE"
  
  # Show states being processed
  for state in "${batch[@]}"; do
    echo "  ⧗ $state: PROCESSING..." | tee -a "$LOG_FILE"
  done
  echo "" | tee -a "$LOG_FILE"
  
  # Create comma-separated list for the prompt
  state_list=$(IFS=,; echo "${batch[*]}")
  
  # Call copilot CLI with the batch
  {
    copilot -p "Please read src/data/README.md for context on the data structure and conventions. Then add state income tax data for the following states: ${state_list}. 

Research the ${YEAR} tax brackets, rates, and standard deductions for each state, then create the appropriate TypeScript files following the same pattern as the existing state files in src/data/${YEAR}/state/. 

Use snake_case for file names (e.g., 'new_hampshire.ts', 'district_of_columbia.ts').

After creating the files, run 'npm run validate-tax-data' to verify they're correct." --allow-tool 'shell(npm,node,npx,ts-node)' --allow-tool 'web_search' --allow-tool 'read' --allow-tool 'write' --allow-all-paths
  } | tee -a "$LOG_FILE"
  
  # Check results after processing
  echo "" | tee -a "$LOG_FILE"
  echo "Batch $batch_num Results:" | tee -a "$LOG_FILE"
  for state in "${batch[@]}"; do
    filename=$(echo "$state" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
    filepath="src/data/${YEAR}/state/${filename}.ts"
    
    if [ -f "$filepath" ]; then
      echo "  ✓ $state: CREATED" | tee -a "$LOG_FILE"
    else
      echo "  ✗ $state: MISSING" | tee -a "$LOG_FILE"
    fi
  done
  echo "" | tee -a "$LOG_FILE"
done

echo "==========================================" | tee -a "$LOG_FILE"
echo "All batches processed!" | tee -a "$LOG_FILE"
echo "Completed: $(date)" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Log file saved to: $LOG_FILE" | tee -a "$LOG_FILE"
