<#
.SYNOPSIS
    AI Therapy Starter Kit - Setup Script (Windows)
.DESCRIPTION
    Creates a personalized AI therapy environment with local storage
#>

#Requires -Version 5.1

$ErrorActionPreference = "Stop"

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

#------------------------------------------------------------------------------
# Configuration Variables (set during setup)
#------------------------------------------------------------------------------
$script:TherapistName = ""
$script:Persona = ""
$script:Modalities = @()
$script:SessionStructure = ""
$script:TherapyDir = ""
$script:UseEncryption = $false

#------------------------------------------------------------------------------
# Helper Functions
#------------------------------------------------------------------------------

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor White
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Text)
    Write-Host ""
    Write-Host ">> $Text" -ForegroundColor Blue
}

function Write-Option {
    param([string]$Number, [string]$Text)
    Write-Host "  $Number) $Text" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Text)
    Write-Host "[!] $Text" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Text)
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Info {
    param([string]$Text)
    Write-Host "[i] $Text" -ForegroundColor Cyan
}

function Read-Choice {
    param(
        [string]$Prompt,
        [string]$Default
    )
    $response = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($response)) {
        return $Default
    }
    return $response
}

function Read-YesNo {
    param(
        [string]$Prompt,
        [string]$Default = "y"
    )
    $response = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($response)) {
        $response = $Default
    }
    return $response -match "^[Yy]"
}

#------------------------------------------------------------------------------
# Disclaimer & Safety Check
#------------------------------------------------------------------------------

function Show-Disclaimer {
    Write-Header "AI Therapy Starter Kit"

    Write-Host ""
    Write-Host "This tool creates an AI-assisted therapy environment for self-reflection"
    Write-Host "and emotional support."
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "* This is NOT a replacement for professional mental health care"
    Write-Host "* The AI cannot diagnose conditions or prescribe treatment"
    Write-Host "* If you're in crisis, please contact a crisis line (988 in US)"
    Write-Host ""

    if (-not (Read-YesNo "I understand these limitations. Continue?")) {
        Write-Host "Setup cancelled."
        exit 0
    }
}

function Test-Safety {
    Write-Header "Quick Safety Check"

    Write-Host ""
    Write-Host "This tool works best for everyday emotional support and self-reflection."
    Write-Host "Please answer honestly so we can point you to the right resources."
    Write-Host ""

    $crisisResponse = Read-Host "Are you currently experiencing thoughts of suicide or self-harm? [y/N]"

    if ($crisisResponse -match "^[Yy]") {
        Write-Host ""
        Write-Host ("=" * 60) -ForegroundColor Red
        Write-Host "Please reach out to trained crisis counselors:" -ForegroundColor White
        Write-Host ""
        Write-Host "  988    - Suicide & Crisis Lifeline (call or text)"
        Write-Host "  741741 - Crisis Text Line (text HOME)"
        Write-Host "  911    - If you're in immediate danger"
        Write-Host ""
        Write-Host "  International: https://findahelpline.com"
        Write-Host ""
        Write-Host ("=" * 60) -ForegroundColor Red
        Write-Host ""
        Write-Host "This tool will still be here when you're ready."
        Write-Host "Please reach out to the resources above first."
        exit 0
    }

    $impairmentResponse = Read-Host "Symptoms that significantly impair daily functioning? [y/N]"

    if ($impairmentResponse -match "^[Yy]") {
        Write-Host ""
        Write-Warning-Custom "Consider consulting a mental health professional for evaluation."
        Write-Info "This tool can supplement professional care, but may not be sufficient alone."
        Write-Host ""
        if (-not (Read-YesNo "Continue with setup anyway?")) {
            Write-Host "Setup cancelled. Take care of yourself."
            exit 0
        }
    }

    Write-Success "Safety check complete"
}

#------------------------------------------------------------------------------
# Configuration Questions
#------------------------------------------------------------------------------

function Select-TherapistName {
    Write-Header "Step 1: Name Your AI Therapist"

    Write-Host ""
    Write-Host "Give your AI therapist a name. This personalizes the experience."
    Write-Host ""
    Write-Host "Examples: Dr. Ruby, Sage, Alex, Dr. Chen, or any name that feels right."
    Write-Host ""

    $script:TherapistName = Read-Choice "Therapist name" "Sage"
    Write-Success "Your therapist will be called: $script:TherapistName"
}

function Select-Persona {
    Write-Header "Step 2: Communication Style"

    Write-Host ""
    Write-Host "How do you want your AI therapist to communicate?"
    Write-Host ""

    Write-Option "1" "Warm & Supportive - Validation first, gentle challenges, nurturing"
    Write-Option "2" "Direct & Challenging - Will push back, Socratic, insight-focused"
    Write-Option "3" "Coach - Action-oriented, goal-focused, builds momentum"
    Write-Host ""

    $choice = Read-Choice "Choose style (1-3)" "1"

    switch ($choice) {
        "1" { $script:Persona = "warm-supportive" }
        "2" { $script:Persona = "direct-challenging" }
        "3" { $script:Persona = "coach" }
        default { $script:Persona = "warm-supportive" }
    }

    Write-Success "Selected: $script:Persona"
}

function Select-Modalities {
    Write-Header "Step 3: Therapeutic Approaches"

    Write-Host ""
    Write-Host "Which therapeutic approaches should your AI use?"
    Write-Host "Select all that apply (comma-separated, e.g., 1,2,3)"
    Write-Host ""

    Write-Option "1" "CBT (Cognitive Behavioral) - Thoughts affect feelings and actions"
    Write-Option "2" "ACT (Acceptance & Commitment) - Values-based, mindful acceptance"
    Write-Option "3" "DBT Skills - Emotional regulation, distress tolerance"
    Write-Host ""
    Write-Info "All three are recommended for a well-rounded approach."
    Write-Host ""

    $choice = Read-Choice "Select approaches" "1,2,3"

    $script:Modalities = @()
    if ($choice -match "1") { $script:Modalities += "cbt" }
    if ($choice -match "2") { $script:Modalities += "act" }
    if ($choice -match "3") { $script:Modalities += "dbt-skills" }

    if ($script:Modalities.Count -eq 0) {
        $script:Modalities = @("cbt", "act", "dbt-skills")
    }

    Write-Success "Selected: $($script:Modalities -join ', ')"
}

function Select-SessionStructure {
    Write-Header "Step 4: Session Structure"

    Write-Host ""
    Write-Host "How structured do you want your sessions?"
    Write-Host ""

    Write-Option "1" "Structured - Homework, exercises, tracking progress"
    Write-Option "2" "Moderate - Some structure, flexible approach"
    Write-Option "3" "Freeform - Just conversation, minimal assignments"
    Write-Host ""

    $choice = Read-Choice "Choose structure (1-3)" "2"

    switch ($choice) {
        "1" { $script:SessionStructure = "structured" }
        "2" { $script:SessionStructure = "moderate" }
        "3" { $script:SessionStructure = "freeform" }
        default { $script:SessionStructure = "moderate" }
    }

    Write-Success "Selected: $script:SessionStructure"
}

function Select-StorageLocation {
    Write-Header "Step 5: Storage Location"

    Write-Host ""
    Write-Host "Where should your therapy files be stored?"
    Write-Host ""
    Write-Host "Your sessions and profile will be saved as markdown files."
    $defaultPath = Join-Path $env:USERPROFILE "ai-therapy"
    Write-Host "Default location: $defaultPath"
    Write-Host ""

    $script:TherapyDir = Read-Choice "Storage path" $defaultPath
    Write-Success "Files will be stored in: $script:TherapyDir"
}

function Select-Encryption {
    Write-Header "Step 6: Security"

    Write-Host ""
    Write-Host "How secure do you need your therapy data?"
    Write-Host ""

    Write-Option "1" "Standard - Files stored locally, not synced (good for most users)"
    Write-Option "2" "Encrypted - Password-protected folder (requires VeraCrypt)"
    Write-Host ""
    Write-Info "Encryption uses VeraCrypt (free, open-source, AES-256)."
    Write-Info "Download from: https://veracrypt.fr"
    Write-Host ""

    $choice = Read-Choice "Choose security level (1-2)" "1"

    $script:UseEncryption = ($choice -eq "2")

    if ($script:UseEncryption) {
        Write-Success "Encryption enabled"
    } else {
        Write-Success "Standard storage (no encryption)"
    }
}

#------------------------------------------------------------------------------
# File Generation
#------------------------------------------------------------------------------

function Get-SessionStructureContent {
    switch ($script:SessionStructure) {
        "structured" {
            return @"
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
"@
        }
        "moderate" {
            return @"
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
"@
        }
        "freeform" {
            return @"
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
"@
        }
    }
}

function Get-ToneModifier {
    switch ($script:Persona) {
        "warm-supportive" {
            return "Can shift to casual/informal for rapport; tends toward softer, more nurturing language; prioritizes safety and validation before challenge."
        }
        "direct-challenging" {
            return "Direct without being harsh; will push back and name patterns; uses Socratic questioning; treats the person as capable of handling honest feedback."
        }
        "coach" {
            return "Action-oriented and goal-focused; celebrates wins and builds momentum; less processing, more problem-solving; provides accountability for commitments."
        }
    }
}

function Build-ClaudeMd {
    param([string]$OutputDir)

    Write-Step "Assembling your personalized CLAUDE.md..."

    $templatePath = Join-Path $ScriptDir "CLAUDE.template.md"
    $content = Get-Content $templatePath -Raw

    # Replace variables
    $content = $content -replace '\{\{THERAPIST_NAME\}\}', $script:TherapistName
    $content = $content -replace '\{\{THERAPY_DIR\}\}', $script:TherapyDir
    $content = $content -replace '\{\{TONE_MODIFIER\}\}', (Get-ToneModifier)
    $content = $content -replace '\{\{SESSION_STRUCTURE\}\}', (Get-SessionStructureContent)

    # Read persona file
    $personaPath = Join-Path $ScriptDir "personas\$($script:Persona).md"
    if (Test-Path $personaPath) {
        $personaContent = Get-Content $personaPath -Raw

        # Extract description (simplified extraction)
        $personaDesc = "See persona file for full description."
        $personaStyle = "See persona file for communication patterns."

        if ($personaContent -match '## Persona Description([\s\S]*?)## Communication Style') {
            $personaDesc = $Matches[1].Trim()
        }
        if ($personaContent -match '## Communication Style([\s\S]*?)## (Challenge Style|Session Structure|Tone Modifier|When to Shift)') {
            $personaStyle = $Matches[1].Trim()
        }

        $content = $content -replace '\{\{PERSONA_DESCRIPTION\}\}', $personaDesc
        $content = $content -replace '\{\{PERSONA_STYLE\}\}', $personaStyle
    }

    # Combine modality content
    $modalityContent = ""
    foreach ($mod in $script:Modalities) {
        $modPath = Join-Path $ScriptDir "modalities\$mod.md"
        if (Test-Path $modPath) {
            $modalityContent += Get-Content $modPath -Raw
            $modalityContent += "`n`n---`n`n"
        }
    }
    $content = $content -replace '\{\{MODALITY_CONTENT\}\}', $modalityContent

    # Focus areas placeholder
    $focusPlaceholder = @"
*Add your focus areas here as you begin working together.*

Example areas:
- Anxiety management
- Relationship patterns
- Work stress
- Self-esteem
- Life transitions
"@
    $content = $content -replace '\{\{FOCUS_AREAS\}\}', $focusPlaceholder

    # Write file
    $outputPath = Join-Path $OutputDir "CLAUDE.md"
    Set-Content -Path $outputPath -Value $content -Encoding UTF8
    Write-Success "Created CLAUDE.md"
}

function New-DirectoryStructure {
    param([string]$BaseDir)

    Write-Step "Creating directory structure..."

    # Create directories
    New-Item -ItemType Directory -Path $BaseDir -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $BaseDir "sessions") -Force | Out-Null

    # Copy profile template
    $profileTemplate = Join-Path $ScriptDir "profile.template.md"
    $profileDest = Join-Path $BaseDir "profile.md"
    Copy-Item $profileTemplate $profileDest
    Write-Success "Created profile.md"

    # Create .gitignore
    $gitignore = @"
# Sensitive therapy data - never commit
profile.md
sessions/

# Environment files
.env
.env.local

# Windows
Thumbs.db
desktop.ini

# VeraCrypt
*.hc
"@
    Set-Content -Path (Join-Path $BaseDir ".gitignore") -Value $gitignore
    Write-Success "Created .gitignore"

    # Create sessions README
    $sessionsReadme = @"
# Sessions Directory

Session notes are stored here automatically.
Each session is saved as YYYY-MM-DD.md

These files contain sensitive information and are excluded from git.
"@
    Set-Content -Path (Join-Path $BaseDir "sessions\.gitkeep") -Value $sessionsReadme
    Write-Success "Created sessions directory"
}

function Initialize-Encryption {
    param([string]$BaseDir)

    Write-Step "Setting up encryption..."

    $veracryptPath = "C:\Program Files\VeraCrypt\VeraCrypt.exe"

    if (-not (Test-Path $veracryptPath)) {
        Write-Warning-Custom "VeraCrypt not found at expected location."
        Write-Host ""
        Write-Host "Please install VeraCrypt from: https://veracrypt.fr"
        Write-Host ""
        Write-Host "After installing:"
        Write-Host "1. Open VeraCrypt"
        Write-Host "2. Create a new encrypted volume"
        Write-Host "3. Choose 'Create an encrypted file container'"
        Write-Host "4. Set size to at least 500MB"
        Write-Host "5. Mount the volume and run this setup again pointing to the mounted drive"
        Write-Host ""

        if (Read-YesNo "Continue with standard (non-encrypted) setup instead?") {
            $script:UseEncryption = $false
            return
        } else {
            Write-Host "Setup cancelled. Install VeraCrypt and try again."
            exit 0
        }
    }

    Write-Info "VeraCrypt found. Please create an encrypted container manually."
    Write-Host ""
    Write-Host "Quick guide:"
    Write-Host "1. Open VeraCrypt"
    Write-Host "2. Click 'Create Volume'"
    Write-Host "3. Select 'Create an encrypted file container'"
    Write-Host "4. Choose 'Standard VeraCrypt volume'"
    Write-Host "5. Save as: $env:USERPROFILE\therapy-vault.hc"
    Write-Host "6. Set size to 500MB or more"
    Write-Host "7. Choose a strong password"
    Write-Host "8. Mount the volume to a drive letter (e.g., T:)"
    Write-Host ""

    $mountedDrive = Read-Choice "Enter the mounted drive letter (e.g., T)" "T"
    $script:TherapyDir = "${mountedDrive}:\ai-therapy"

    Write-Success "Will use encrypted drive: $script:TherapyDir"
}

#------------------------------------------------------------------------------
# Main Setup Flow
#------------------------------------------------------------------------------

function Main {
    Clear-Host

    # Welcome and disclaimers
    Show-Disclaimer
    Test-Safety

    # Configuration
    Select-TherapistName
    Select-Persona
    Select-Modalities
    Select-SessionStructure
    Select-StorageLocation
    Select-Encryption

    # Setup
    Write-Header "Setting Up Your Therapy Environment"

    if ($script:UseEncryption) {
        Initialize-Encryption $script:TherapyDir
    }

    # Create structure
    New-DirectoryStructure $script:TherapyDir
    Build-ClaudeMd $script:TherapyDir

    # Final summary
    Write-Header "Setup Complete!"

    Write-Host ""
    Write-Host "Your AI therapy environment is ready."
    Write-Host ""
    Write-Host "Location:   $script:TherapyDir" -ForegroundColor White
    Write-Host "Therapist:  $script:TherapistName" -ForegroundColor White
    Write-Host "Style:      $script:Persona" -ForegroundColor White
    Write-Host "Approaches: $($script:Modalities -join ', ')" -ForegroundColor White
    Write-Host "Structure:  $script:SessionStructure" -ForegroundColor White
    if ($script:UseEncryption) {
        Write-Host "Security:   Encrypted (VeraCrypt)" -ForegroundColor White
    } else {
        Write-Host "Security:   Standard (local files)" -ForegroundColor White
    }
    Write-Host ""

    Write-Header "Getting Started"

    Write-Host ""
    Write-Host "1. Open Claude Code in your therapy directory:"
    Write-Host "   cd `"$script:TherapyDir`" ; claude" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Start a session by talking to $script:TherapistName"
    Write-Host ""
    Write-Host "3. End sessions naturally - notes will be saved automatically"
    Write-Host ""

    if ($script:UseEncryption) {
        Write-Host "Remember: Mount your VeraCrypt volume before each session" -ForegroundColor Yellow
        Write-Host ""
    }

    Write-Host ("=" * 60)
    Write-Host ""
    Write-Host "If you find this helpful, consider supporting development:"
    Write-Host "  https://buymeacoffee.com/[YOUR_HANDLE]"
    Write-Host "  https://gumroad.com/[YOUR_HANDLE]"
    Write-Host ""
    Write-Host "Take care of yourself." -ForegroundColor Green
    Write-Host ""
}

# Run main
Main
