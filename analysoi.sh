#!/bin/bash
# Repositorion kielten ja suunnittelumallien heuristinen tunnistus

REPORT="analysis_report.txt"

# Tiedostot, joista suunnittelumalleja etsitään (ei skriptiä itseään eikä raporttia)
GREP_OPTS=(-rIEn
  --include="*.py" --include="*.java" --include="*.js" --include="*.ts"
  --include="*.cs" --include="*.cpp" --include="*.php"
  --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.github
  --exclude=analysoi.sh --exclude="$REPORT")

detect_language() {
  local name="$1" ext="$2"
  local count
  count=$(find . -type f -not -path "./.git/*" -not -path "./node_modules/*" -name "*.$ext" | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "- $name ($count tiedostoa, .$ext)"
  fi
}

check_pattern() {
  local name="$1" regex="$2"
  local matches
  matches=$(grep "${GREP_OPTS[@]}" -e "$regex" . 2>/dev/null)
  if [ -n "$matches" ]; then
    echo "- $name ($(echo "$matches" | wc -l) osumaa)"
    echo "$matches" | head -n 3 | sed 's/^/      /'
  fi
}

{
  echo "=== Repository Analysis Report ==="
  echo "Päivämäärä: $(date -u '+%Y-%m-%d %H:%M UTC')"
  echo

  echo "Detected languages:"
  detect_language "Python" "py"
  detect_language "Java" "java"
  detect_language "JavaScript" "js"
  detect_language "TypeScript" "ts"
  detect_language "C#" "cs"
  detect_language "C++" "cpp"
  detect_language "PHP" "php"
  detect_language "HTML" "html"
  detect_language "CSS" "css"
  detect_language "Shell" "sh"
  detect_language "Markdown" "md"
  echo

  echo "Design patterns detected:"
  check_pattern "Singleton"      'getInstance|static instance|_instance'
  check_pattern "Factory Method" 'create[A-Z][A-Za-z]*\(|[Ff]actory'
  check_pattern "Strategy"       'Strategy'
  check_pattern "Observer"       'notify|subscribe|[Oo]bserver'
  check_pattern "Decorator"      'Decorator|def wrapper|wrap[A-Z(]'
  echo
  echo "=== Raportin loppu ==="
} > "$REPORT"

# Tulostetaan raportti myös Actions-lokiin
cat "$REPORT"
