#!/bin/bash

# AI Therapy Starter Kit - Setup Script (macOS)
# Creates a personalized AI therapy environment with local storage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Get the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

#------------------------------------------------------------------------------
# Helper Functions
#------------------------------------------------------------------------------

print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_step() {
    echo ""
    echo -e "${BLUE}▸${NC} ${BOLD}$1${NC}"
}

print_option() {
    echo -e "  ${GREEN}$1${NC}) $2"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_success() {
    echo -e "${GREEN}✓${NC}  $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC}  $1"
}

prompt_choice() {
    local prompt="$1"
    local default="$2"
    local result

    echo -ne "${prompt} [${default}]: " >&2
    read -r result
    echo "${result:-$default}"
}

prompt_yes_no() {
    local prompt="$1"
    local default="$2"
    local result

    echo -ne "${prompt} [${default}]: " >&2
    read -r result
    result="${result:-$default}"
    [[ "$result" =~ ^[Yy] ]]
}

#------------------------------------------------------------------------------
# Disclaimer & Safety Check
#------------------------------------------------------------------------------

show_disclaimer() {
    print_header "AI Therapy Starter Kit"

    echo ""
    echo "This tool creates an AI-assisted therapy environment for self-reflection"
    echo "and emotional support."
    echo ""
    echo -e "${YELLOW}${BOLD}IMPORTANT:${NC}"
    echo "• This is NOT a replacement for professional mental health care"
    echo "• The AI cannot diagnose conditions or prescribe treatment"
    echo "• If you're in crisis, please contact a crisis line (988 in US)"
    echo ""

    if ! prompt_yes_no "I understand these limitations. Continue?" "y"; then
        echo "Setup cancelled."
        exit 0
    fi
}

safety_screening() {
    print_header "Quick Safety Check"

    echo ""
    echo "This tool works best for everyday emotional support and self-reflection."
    echo "Please answer honestly so we can point you to the right resources."
    echo ""

    echo "Are you currently experiencing any of the following?"
    echo ""

    echo -ne "Thoughts of suicide or self-harm? [y/N]: "
    read -r crisis_response

    if [[ "$crisis_response" =~ ^[Yy] ]]; then
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BOLD}Please reach out to trained crisis counselors:${NC}"
        echo ""
        echo "  988    - Suicide & Crisis Lifeline (call or text)"
        echo "  741741 - Crisis Text Line (text HOME)"
        echo "  911    - If you're in immediate danger"
        echo ""
        echo "  International: https://findahelpline.com"
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "This tool will still be here when you're ready."
        echo "Please reach out to the resources above first."
        exit 0
    fi

    echo -ne "Symptoms that significantly impair daily functioning? [y/N]: "
    read -r impairment_response

    if [[ "$impairment_response" =~ ^[Yy] ]]; then
        echo ""
        print_warning "Consider consulting a mental health professional for evaluation."
        print_info "This tool can supplement professional care, but may not be sufficient alone."
        echo ""
        if ! prompt_yes_no "Continue with setup anyway?" "y"; then
            echo "Setup cancelled. Take care of yourself."
            exit 0
        fi
    fi

    print_success "Safety check complete"
}

#------------------------------------------------------------------------------
# Configuration Questions
#------------------------------------------------------------------------------

choose_therapist_name() {
    print_header "Step 1: Name Your AI Therapist"

    echo ""
    echo "Give your AI therapist a name. This personalizes the experience."
    echo ""
    echo "Examples: Dr. Ruby, Sage, Alex, Dr. Chen, or any name that feels right."
    echo ""

    THERAPIST_NAME=$(prompt_choice "Therapist name" "Sage")
    print_success "Your therapist will be called: $THERAPIST_NAME"
}

choose_persona() {
    print_header "Step 2: Communication Style"

    echo ""
    echo "How do you want your AI therapist to communicate?"
    echo ""

    print_option "1" "Warm & Supportive - Validation first, gentle challenges, nurturing"
    print_option "2" "Direct & Challenging - Will push back, Socratic, insight-focused"
    print_option "3" "Coach - Action-oriented, goal-focused, builds momentum"
    echo ""

    local choice
    choice=$(prompt_choice "Choose style (1-3)" "1")

    case $choice in
        1) PERSONA="warm-supportive" ;;
        2) PERSONA="direct-challenging" ;;
        3) PERSONA="coach" ;;
        *) PERSONA="warm-supportive" ;;
    esac

    print_success "Selected: $PERSONA"
}

choose_modalities() {
    print_header "Step 3: Therapeutic Approaches"

    echo ""
    echo "Which therapeutic approaches should your AI use?"
    echo "Select all that apply (comma-separated, e.g., 1,2,3)"
    echo ""

    print_option "1" "CBT (Cognitive Behavioral) - Thoughts affect feelings and actions"
    print_option "2" "ACT (Acceptance & Commitment) - Values-based, mindful acceptance"
    print_option "3" "DBT Skills - Emotional regulation, distress tolerance"
    echo ""
    print_info "All three are recommended for a well-rounded approach."
    echo ""

    local choice
    choice=$(prompt_choice "Select approaches" "1,2,3")

    MODALITIES=()
    if [[ "$choice" == *"1"* ]]; then MODALITIES+=("cbt"); fi
    if [[ "$choice" == *"2"* ]]; then MODALITIES+=("act"); fi
    if [[ "$choice" == *"3"* ]]; then MODALITIES+=("dbt-skills"); fi

    # Default to all if nothing selected
    if [ ${#MODALITIES[@]} -eq 0 ]; then
        MODALITIES=("cbt" "act" "dbt-skills")
    fi

    print_success "Selected: ${MODALITIES[*]}"
}

choose_session_structure() {
    print_header "Step 4: Session Structure"

    echo ""
    echo "How structured do you want your sessions?"
    echo ""

    print_option "1" "Structured - Homework, exercises, tracking progress"
    print_option "2" "Moderate - Some structure, flexible approach"
    print_option "3" "Freeform - Just conversation, minimal assignments"
    echo ""

    local choice
    choice=$(prompt_choice "Choose structure (1-3)" "2")

    case $choice in
        1) SESSION_STRUCTURE="structured" ;;
        2) SESSION_STRUCTURE="moderate" ;;
        3) SESSION_STRUCTURE="freeform" ;;
        *) SESSION_STRUCTURE="moderate" ;;
    esac

    print_success "Selected: $SESSION_STRUCTURE"
}

choose_storage_location() {
    print_header "Step 5: Storage Location"

    echo ""
    echo "Where should your therapy files be stored?"
    echo ""
    echo "Your sessions and profile will be saved as markdown files."
    echo "Default location: ~/ai-therapy"
    echo ""

    THERAPY_DIR=$(prompt_choice "Storage path" "$HOME/ai-therapy")

    # Expand ~ if used
    THERAPY_DIR="${THERAPY_DIR/#\~/$HOME}"

    print_success "Files will be stored in: $THERAPY_DIR"
}

choose_encryption() {
    print_header "Step 6: Security"

    echo ""
    echo "How secure do you need your therapy data?"
    echo ""

    print_option "1" "Standard - Files stored locally, not synced (good for most users)"
    print_option "2" "Encrypted - Password-protected vault (recommended for shared computers)"
    echo ""
    print_info "Encryption uses macOS built-in encrypted disk images (AES-256)."
    echo ""

    local choice
    choice=$(prompt_choice "Choose security level (1-2)" "1")

    case $choice in
        2) USE_ENCRYPTION=true ;;
        *) USE_ENCRYPTION=false ;;
    esac

    if $USE_ENCRYPTION; then
        print_success "Encryption enabled"
    else
        print_success "Standard storage (no encryption)"
    fi
}

#------------------------------------------------------------------------------
# File Generation
#------------------------------------------------------------------------------

generate_session_structure_content() {
    case $SESSION_STRUCTURE in
        structured)
            cat << 'EOF'
### Session Flow

**Opening (5 min)**
- Check in on emotional state
- Review homework from last session

**Core Work (main portion)**
- Address presenting concerns
- Apply therapeutic techniques
- Build skills and insights

**Closing (5 min)**
- Summarize key takeaways
- Assign specific homework
- Preview next focus area

### Homework Expectations

- Specific, concrete assignments each session
- Always follow up at next session start
- Track completion and obstacles
- Adjust difficulty based on success rate

### Progress Tracking

- Note behavioral changes across sessions
- Reference previous insights
- Celebrate wins and acknowledge effort
EOF
            ;;
        moderate)
            cat << 'EOF'
### Session Flow

**Check-in**
- How are you doing since last time?
- Any homework to review?

**Exploration**
- Follow what's alive for the client
- Apply techniques when appropriate
- Balance processing with skill-building

**Closing**
- What's landing from today?
- Optional: something to try before next time

### Homework Approach

- Offer exercises when they fit naturally
- No pressure if homework isn't done
- Explore what got in the way (useful data)
- Flexibility over rigidity
EOF
            ;;
        freeform)
            cat << 'EOF'
### Session Flow

- Follow the client's lead
- Minimal structure, maximum presence
- Techniques offered organically, not prescribed
- No formal homework unless requested

### Approach

- Create space for whatever needs to emerge
- Trust the process
- Insight and connection over assignments
- Let the conversation go where it needs to go
EOF
            ;;
    esac
}

generate_tone_modifier() {
    case $PERSONA in
        warm-supportive)
            echo "Can shift to casual/informal for rapport; tends toward softer, more nurturing language; prioritizes safety and validation before challenge."
            ;;
        direct-challenging)
            echo "Direct without being harsh; will push back and name patterns; uses Socratic questioning; treats the person as capable of handling honest feedback."
            ;;
        coach)
            echo "Action-oriented and goal-focused; celebrates wins and builds momentum; less processing, more problem-solving; provides accountability for commitments."
            ;;
    esac
}

assemble_claude_md() {
    print_step "Assembling your personalized CLAUDE.md..."

    local output_file="$1/CLAUDE.md"
    local template="$SCRIPT_DIR/CLAUDE.template.md"

    # Read template
    local content
    content=$(cat "$template")

    # Replace therapist name
    content="${content//\{\{THERAPIST_NAME\}\}/$THERAPIST_NAME}"

    # Replace therapy directory
    content="${content//\{\{THERAPY_DIR\}\}/$THERAPY_DIR}"

    # Generate and replace tone modifier
    local tone_modifier
    tone_modifier=$(generate_tone_modifier)
    content="${content//\{\{TONE_MODIFIER\}\}/$tone_modifier}"

    # Read and insert persona content
    local persona_file="$SCRIPT_DIR/personas/${PERSONA}.md"
    if [ -f "$persona_file" ]; then
        local persona_desc
        local persona_style

        # Extract description (between first ## and second ##)
        persona_desc=$(awk '/^## Persona Description/,/^## Communication Style/' "$persona_file" | grep -v "^##" | head -20)

        # Extract style section
        persona_style=$(awk '/^## Communication Style/,/^## (Challenge Style|Session Structure|Tone Modifier|When to Shift)/' "$persona_file" | grep -v "^##")

        content="${content//\{\{PERSONA_DESCRIPTION\}\}/$persona_desc}"
        content="${content//\{\{PERSONA_STYLE\}\}/$persona_style}"
    fi

    # Read and combine modality content
    local modality_content=""
    for mod in "${MODALITIES[@]}"; do
        local mod_file="$SCRIPT_DIR/modalities/${mod}.md"
        if [ -f "$mod_file" ]; then
            modality_content+=$(cat "$mod_file")
            modality_content+=$'\n\n---\n\n'
        fi
    done
    content="${content//\{\{MODALITY_CONTENT\}\}/$modality_content}"

    # Generate session structure content
    local session_content
    session_content=$(generate_session_structure_content)
    content="${content//\{\{SESSION_STRUCTURE\}\}/$session_content}"

    # Focus areas - leave as placeholder for user to fill
    local focus_placeholder="*Add your focus areas here as you begin working together.*

Example areas:
- Anxiety management
- Relationship patterns
- Work stress
- Self-esteem
- Life transitions"
    content="${content//\{\{FOCUS_AREAS\}\}/$focus_placeholder}"

    # Write the file
    echo "$content" > "$output_file"
    print_success "Created CLAUDE.md"
}

create_directory_structure() {
    local base_dir="$1"

    print_step "Creating directory structure..."

    mkdir -p "$base_dir/sessions"

    # Copy profile template
    cp "$SCRIPT_DIR/profile.template.md" "$base_dir/profile.md"
    print_success "Created profile.md"

    # Create .gitignore
    cat > "$base_dir/.gitignore" << 'EOF'
# Sensitive therapy data - never commit
profile.md
sessions/

# Environment files
.env
.env.local

# macOS
.DS_Store

# Encrypted vault files (if using encryption)
*.sparsebundle
EOF
    print_success "Created .gitignore"

    # Create sessions README
    cat > "$base_dir/sessions/.gitkeep" << 'EOF'
# Sessions Directory

Session notes are stored here automatically.
Each session is saved as YYYY-MM-DD.md

These files contain sensitive information and are excluded from git.
EOF
    print_success "Created sessions directory"
}

setup_encryption() {
    local base_dir="$1"

    print_step "Setting up encrypted vault..."

    local vault_path="$HOME/therapy-vault.sparsebundle"
    local mount_point="/Volumes/TherapyVault"

    echo ""
    print_info "Creating encrypted disk image..."
    print_info "You'll be prompted to set a password."
    echo ""

    # Create encrypted sparse bundle
    hdiutil create -size 500m -encryption AES-256 -type SPARSEBUNDLE \
        -fs "APFS" -volname "TherapyVault" "$vault_path"

    # Mount it
    hdiutil attach "$vault_path"

    # Update therapy dir to mounted volume
    THERAPY_DIR="$mount_point"

    # Create helper scripts
    cat > "$HOME/mount-therapy.command" << EOF
#!/bin/bash
# Double-click to mount your therapy vault
hdiutil attach "$vault_path"
echo "Therapy vault mounted at $mount_point"
echo "Press any key to close..."
read -n 1
EOF
    chmod +x "$HOME/mount-therapy.command"

    cat > "$HOME/unmount-therapy.command" << EOF
#!/bin/bash
# Double-click to safely unmount your therapy vault
hdiutil detach "$mount_point"
echo "Therapy vault unmounted"
echo "Press any key to close..."
read -n 1
EOF
    chmod +x "$HOME/unmount-therapy.command"

    print_success "Encrypted vault created at: $vault_path"
    print_success "Created mount-therapy.command on Desktop"
    print_success "Created unmount-therapy.command on Desktop"
    print_warning "Remember your password! It cannot be recovered."

    # Move helper scripts to Desktop for easy access
    mv "$HOME/mount-therapy.command" "$HOME/Desktop/" 2>/dev/null || true
    mv "$HOME/unmount-therapy.command" "$HOME/Desktop/" 2>/dev/null || true
}

#------------------------------------------------------------------------------
# Main Setup Flow
#------------------------------------------------------------------------------

main() {
    clear

    # Welcome and disclaimers
    show_disclaimer
    safety_screening

    # Configuration
    choose_therapist_name
    choose_persona
    choose_modalities
    choose_session_structure
    choose_storage_location
    choose_encryption

    # Setup
    print_header "Setting Up Your Therapy Environment"

    if $USE_ENCRYPTION; then
        setup_encryption "$THERAPY_DIR"
    fi

    # Create directories (in encrypted vault if enabled)
    mkdir -p "$THERAPY_DIR"
    create_directory_structure "$THERAPY_DIR"
    assemble_claude_md "$THERAPY_DIR"

    # Final summary
    print_header "Setup Complete!"

    echo ""
    echo "Your AI therapy environment is ready."
    echo ""
    echo -e "${BOLD}Location:${NC} $THERAPY_DIR"
    echo -e "${BOLD}Therapist:${NC} $THERAPIST_NAME"
    echo -e "${BOLD}Style:${NC} $PERSONA"
    echo -e "${BOLD}Approaches:${NC} ${MODALITIES[*]}"
    echo -e "${BOLD}Structure:${NC} $SESSION_STRUCTURE"
    if $USE_ENCRYPTION; then
        echo -e "${BOLD}Security:${NC} Encrypted (AES-256)"
    else
        echo -e "${BOLD}Security:${NC} Standard (local files)"
    fi
    echo ""

    print_header "Getting Started"

    echo ""
    echo "1. Open Claude Code in your therapy directory:"
    echo -e "   ${CYAN}cd \"$THERAPY_DIR\" && claude${NC}"
    echo ""
    echo "2. Start a session by talking to $THERAPIST_NAME"
    echo ""
    echo "3. End sessions naturally - notes will be saved automatically"
    echo ""

    if $USE_ENCRYPTION; then
        echo -e "${YELLOW}Remember:${NC} Mount your vault before each session using:"
        echo "   Double-click 'mount-therapy.command' on your Desktop"
        echo "   Or run: hdiutil attach ~/therapy-vault.sparsebundle"
        echo ""
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "If you find this helpful, consider supporting development:"
    echo "  https://buymeacoffee.com/[YOUR_HANDLE]"
    echo "  https://gumroad.com/[YOUR_HANDLE]"
    echo ""
    echo "Take care of yourself. 💚"
    echo ""
}

# Run main
main "$@"
