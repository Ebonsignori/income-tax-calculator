#!/bin/bash

################################################################################
# Audit State Tax Data Script
#
# This script automates the process of auditing state income tax data for a 
# specified year by using the GitHub Copilot CLI to verify the accuracy of 
# tax brackets, rates, and standard deductions in existing TypeScript files.
#
# The script processes states in batches of 5, checking each state's data 
# against authoritative sources and reporting any discrepancies.
#
# Usage:
#   ./scripts/audit-state-tax-data.sh [-y YEAR]
#
# Options:
#   -y YEAR    Specify the tax year to audit (e.g., 2025). If not provided, 
#              you will be prompted to enter it.
#
# Examples:
#   # Interactive mode (prompts for year)
#   ./scripts/audit-state-tax-data.sh
#
#   # With year specified
#   ./scripts/audit-state-tax-data.sh -y 2025
#
# Requirements:
#   - GitHub Copilot CLI must be installed and authenticated
#   - Node.js and npm must be installed (for validation script)
#
# The script will:
#   1. Find all state files in src/data/{YEAR}/state/
#   2. Research current tax data for each state
#   3. Compare against the data in the existing TypeScript files
#   4. Report any discrepancies or outdated information
#   5. Suggest corrections if needed
#   6. Pause between batches for review
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
  read -p "Enter the year to audit state data for (e.g., 2025): " YEAR
fi

# Validate year
if ! [[ "$YEAR" =~ ^[0-9]{4}$ ]]; then
  echo "Error: Invalid year format. Please enter a 4-digit year."
  exit 1
fi

# Check if the year directory exists
if [ ! -d "src/data/${YEAR}/state" ]; then
  echo "Error: Directory src/data/${YEAR}/state does not exist."
  echo "Please make sure the year is correct and that state data exists for this year."
  exit 1
fi

echo "Auditing state tax data for year: $YEAR"
echo ""

# Create log file with timestamp
LOG_FILE="logs/audit-states-${YEAR}-$(date +%Y%m%d-%H%M%S).log"
mkdir -p logs

echo "State Tax Data Audit - Year: $YEAR" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Get list of existing state files (without .ts extension)
state_files=(src/data/${YEAR}/state/*.ts)
states=()

for file in "${state_files[@]}"; do
  # Extract filename without path and extension
  filename=$(basename "$file" .ts)
  
  # Convert snake_case to Title Case for display
  # e.g., new_hampshire -> New Hampshire
  state_name=$(echo "$filename" | sed 's/_/ /g' | sed 's/\b\(.\)/\u\1/g')
  states+=("$state_name")
done

total=${#states[@]}

if [ $total -eq 0 ]; then
  echo "No state files found in src/data/${YEAR}/state/" | tee -a "$LOG_FILE"
  exit 1
fi

echo "Found $total state(s) to audit." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Process states in batches of 5
batch_size=5

for ((i=0; i<$total; i+=batch_size)); do
  batch=("${states[@]:i:batch_size}")
  batch_num=$((i/batch_size + 1))
  
  echo "==========================================" | tee -a "$LOG_FILE"
  echo "Auditing Batch $batch_num: ${batch[*]}" | tee -a "$LOG_FILE"
  echo "==========================================" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
  
  # Create comma-separated list for the prompt
  state_list=$(IFS=,; echo "${batch[*]}")
  
  # Call copilot CLI with the batch
  copilot -p "Please audit the state income tax data for the following states: ${state_list}.

For each state, perform the following steps:

1. Read the existing TypeScript file in src/data/${YEAR}/state/ (use snake_case for filenames, e.g., 'new_hampshire.ts', 'district_of_columbia.ts')

2. Research the official ${YEAR} tax brackets, rates, and standard deductions from authoritative sources (state government websites, tax foundation, etc.)

3. Compare the data in the file against your research findings

4. Report any discrepancies, including:
   - Incorrect tax rates or brackets
   - Missing tax brackets
   - Incorrect standard deduction amounts
   - Missing or incorrect filing status categories
   - Any other data accuracy issues

5. If you find issues, suggest the corrections needed

6. Also verify:
   - File follows the conventions in src/data/README.md
   - Constants are properly imported from src/constants/
   - Data structure matches the TaxData type
   - Rates are expressed as percentages (not decimals)

Please provide a summary for each state with a clear status indicator:
- ✓ ACCURATE: Data is correct and up-to-date
- ⚠ NEEDS UPDATE: Discrepancies found (with details)
- ✗ ERROR: Critical issues found

Format your response clearly so it can be easily parsed in a log file." --allow-tool 'web_search' --allow-tool 'read' --allow-all-paths | tee -a "$LOG_FILE"
  
  echo "" | tee -a "$LOG_FILE"
done

echo "==========================================" | tee -a "$LOG_FILE"
echo "All batches audited!" | tee -a "$LOG_FILE"
echo "Completed: $(date)" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Log file saved to: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Next steps if corrections are needed:" | tee -a "$LOG_FILE"
echo "1. Make manual edits to the files" | tee -a "$LOG_FILE"
echo "2. Use the add-remaining-states.sh script to regenerate specific states" | tee -a "$LOG_FILE"
echo "3. Run 'npm run validate-tax-data' to verify file structure" | tee -a "$LOG_FILE"
