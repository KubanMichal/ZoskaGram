ls – list directory
cd – change directory
npm run dev – spustit projekt
npm run dev - pusti server(developer mode)
npm build 
npm start
ctrl + c – ukonci server

<Container> - ako div + responzivita webu
app = rout(smeruje)
v stranke za/pisem nazov folderu, script sa vzdy vola page.tsx
layout – rozlozenie stranky

function – class v pythone, mozeme ju zavolat, ked chcem importnut do ineho scriptu, pouzijem import a dam nazov foldru a funkciu

Git – localne branchove ulozisko
Github – cloudove ulozisko zdrojovich kodov

git init – inicializacia na locale
Git branch -m „name“ – pomenovanie branchu
git config –global user.name „name„ – log mena na real ucte
git config –global user.email „email„ – log email na real ucte
git remote add origin https://github.com/name/repo – do akeho projektu to bude commitovat
git remote -v test ci sme spojili local a cloud spravne
nainstalovat – gitlens, github pulll request
git add . – vklada path/aktualnu zlozku

vypis struktury:
#!/bin/bash
function list_dir {
  local dir=$1
  local prefix=$2
  echo "$prefix|-- $(basename $dir)"
  for file in "$dir"/*; do
    if [ -d "$file" ]; then
      # Exclude node_modules, .next, and .git directories
      case "$(basename "$file")" in
        node_modules|.next|.git)
          continue
          ;;
        *)
          list_dir "$file" "$prefix   "
          ;;
      esac
    elif [ -f "$file" ]; then
      # Display files as well
      echo "$prefix   |-- $(basename "$file")"
    fi
  done
}

list_dir "." ""


