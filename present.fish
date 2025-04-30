#! /usr/bin/env fish

function _log
    git log \
        --oneline --color=always \
        --format=format:'%C(bold blue)%h%C(reset) %C(normal)%s%C(reset)'
end

_log | fzf \
    --scheme=history \
    --no-input \
    --height=100% \
    --ansi \
    --preview="git show --format=format:'%C(bold)%s%C(reset)%n%n%b' {1} | delta --light --commit-style raw" \
    --preview-window=right,70%
