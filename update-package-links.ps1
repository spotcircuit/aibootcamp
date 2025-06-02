$filePath = "c:\Users\Big Daddy Pyatt\CascadeProjects\aibootcamp\pages\services.js"
$content = Get-Content -Path $filePath -Raw

# Update the Starter Package link in the first tier
$content = $content -replace '(href="\/contact\?source=services&interest=)(.*?)("[\s\S]{1,100}?Lock In Rate[\s\S]{1,10}?<\/Link>[\s\S]{1,100}?Starter Package)', '$1Starter Package$3'

# Update the Pro Package link in the second tier
$content = $content -replace '(href="\/contact\?source=services&interest=)(.*?)("[\s\S]{1,100}?Lock In Rate[\s\S]{1,10}?<\/Link>[\s\S]{1,100}?Pro Package)', '$1Pro Package$3'

# Update the Enterprise Package link in the third tier
$content = $content -replace '(href="\/contact\?source=services&interest=)(.*?)("[\s\S]{1,100}?Lock In Rate[\s\S]{1,10}?<\/Link>[\s\S]{1,100}?Enterprise Package)', '$1Enterprise Package$3'

# Make sure the ROI calculator link at the bottom points to Pro Package
$content = $content -replace '(href="\/contact\?source=services&interest=)(.*?)(" [\s\S]{1,100}?Calculate Your ROI & Get Started)', '$1Pro Package$3'

Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "Package links updated successfully!"
