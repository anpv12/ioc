$commits = git log --all --format="%H" -- "pages/Quản trị/style.css"
foreach ($c in $commits) {
    $lines = (git show "${c}:pages/Quản trị/style.css" | Measure-Object -Line).Lines
    Write-Host "Commit $c - Lines: $lines"
}
