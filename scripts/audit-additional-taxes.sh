#!/bin/bash

################################################################################
# Audit Additional Taxes Script
#
# This script automates the process of auditing state tax data for additional
# state-wide taxes and city-specific taxes that may not be included in the
# existing data files.
#
# The script processes states in batches of 3, checking each state for:
#   1. Additional state-wide taxes beyond standard income tax brackets
#   2. City-specific taxes that should be added to the state file
#
# Usage:
#   ./scripts/audit-additional-taxes.sh [-y YEAR]
#
# Options:
#   -y YEAR    Specify the tax year to audit (e.g., 2025). If not provided, 
#              you will be prompted to enter it.
#
# Examples:
#   # Interactive mode (prompts for year)
#   ./scripts/audit-additional-taxes.sh
#
#   # With year specified
#   ./scripts/audit-additional-taxes.sh -y 2025
#
# Requirements:
#   - GitHub Copilot CLI must be installed and authenticated
#   - Node.js and npm must be installed (for validation script)
#
# The script will:
#   1. Find all state files in src/data/{YEAR}/state/
#   2. Research each state for additional state-wide taxes (payroll, special 
#      income taxes, etc.)
#   3. Research each state for city-specific taxes
#   4. Add any missing taxes to the appropriate files
#   5. Add city names to src/constants/cities.ts if needed
#   6. Add tax type names to src/constants/tax_types.ts if needed
#   7. Validate the updated files
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
  read -p "Enter the year to audit additional taxes for (e.g., 2025): " YEAR
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

echo "Auditing additional taxes for year: $YEAR"
echo ""

# Create log file with timestamp
LOG_FILE="logs/audit-additional-taxes-${YEAR}-$(date +%Y%m%d-%H%M%S).log"
mkdir -p logs

echo "Additional Taxes Audit - Year: $YEAR" | tee "$LOG_FILE"
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
  state_name=$(echo "$filename" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
  states+=("$state_name")
done

total=${#states[@]}

if [ $total -eq 0 ]; then
  echo "No state files found in src/data/${YEAR}/state/" | tee -a "$LOG_FILE"
  exit 1
fi

echo "Found $total state(s) to audit for additional taxes." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Process states in batches of 3
batch_size=3

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
  {
    copilot -p "Please audit the state income tax data for additional taxes for the following states: ${state_list}.

For each state, perform the following steps:

1. Read the existing TypeScript file in src/data/${YEAR}/state/ (use snake_case for filenames, e.g., 'new_hampshire.ts', 'district_of_columbia.ts')

2. Read src/data/README.md for context on the data structure and conventions

3. Read src/constants/cities.ts to see existing city constants

4. Read src/constants/tax_types.ts to see existing tax type constants

5. Research the state for ${YEAR} and check for:
   
   a) ADDITIONAL STATE-WIDE TAXES that are not already in the file, such as:
      - Special payroll taxes
      - Capital gains taxes (if separate from income tax)
      - Supplemental income taxes
      - Any other state-level taxes that affect income

   b) CITY-SPECIFIC TAXES, such as:
      - City income taxes
      - Local payroll taxes
      - Municipal taxes
      - School district taxes (if significant)
      
   Research authoritative sources (state government websites, tax foundation, major city websites, etc.)

6. If you find any ADDITIONAL STATE-WIDE TAXES:
   - Add the appropriate tax type constant to src/constants/tax_types.ts if it doesn't exist
   - Add the tax data to the state file following the conventions in src/data/README.md
   - Use the proper data structure with filing status brackets

7. If you find any CITY-SPECIFIC TAXES:
   - Add each city name constant to src/constants/cities.ts if it doesn't exist (use snake_case)
   - Add the city taxes under the [CITIES] key in the state file
   - Follow the pattern: [CITIES]: { [CITY_NAME]: { [TAX_TYPE]: { [FILING_STATUS]: [...] } } }
   - Include all major cities with local taxes

8. After making any additions, run 'npm run validate-tax-data' to verify the files are correct

IMPORTANT: 
- Only add taxes that are MISSING from the current file
- Don't modify existing tax brackets unless they're incorrect
- Use constants from src/constants/ files - don't use string literals
- Follow snake_case naming conventions
- Make sure rates are expressed as percentages (not decimals)

For each state, provide a clear summary with one of these status indicators:
- ✓ COMPLETE: No additional taxes found (file is complete)
- ✓ UPDATED: Additional taxes added (list what was added)
  - Detail any state-wide taxes added
  - Detail any cities and their taxes added
- ⚠ NEEDS REVIEW: Potential taxes found but need manual verification
- ✗ ERROR: Critical issues encountered

Format your response clearly so it can be easily parsed in a log file." --allow-all-tools --allow-all-paths
  } | tee -a "$LOG_FILE"
  
  echo "" | tee -a "$LOG_FILE"
done

echo "==========================================" | tee -a "$LOG_FILE"
echo "All batches audited!" | tee -a "$LOG_FILE"
echo "Completed: $(date)" | tee -a "$LOG_FILE"
echo "==========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Log file saved to: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Summary:" | tee -a "$LOG_FILE"
echo "- Review the log above for details on additional taxes found" | tee -a "$LOG_FILE"
echo "- Files with missing taxes have been automatically updated" | tee -a "$LOG_FILE"
echo "- New constants may have been added to src/constants/cities.ts and tax_types.ts" | tee -a "$LOG_FILE"
echo "- If any states show 'NEEDS REVIEW', manual verification is required" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Next steps:" | tee -a "$LOG_FILE"
echo "1. Review the log file for all changes made" | tee -a "$LOG_FILE"
echo "2. Check src/constants/cities.ts for any new city constants added" | tee -a "$LOG_FILE"
echo "3. Check src/constants/tax_types.ts for any new tax type constants added" | tee -a "$LOG_FILE"
echo "4. Run 'npm run validate-tax-data' to verify all files" | tee -a "$LOG_FILE"
echo "5. Test the calculator with the updated data" | tee -a "$LOG_FILE"
echo "6. Commit the changes if everything looks correct" | tee -a "$LOG_FILE"
