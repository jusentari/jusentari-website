CXX = g++
EDITOR_DIR = /home/redcedar/current_projects/new-nds-badge/editor
WEBSITE_DIR = ./build
editor:
	cp /home/redcedar/current_projects/new-nds-badge/badge/nds_badge.nds /home/redcedar/current_projects/new-nds-badge/editor/nds_badge.nds
	godot /home/redcedar/current_projects/new-nds-badge/editor/project.godot --export-release "Web" /home/redcedar/current_projects/jusentari-website/static/editor/NDSBadgeEditor.html

website:
	npm run build

deploy: editor website
	scp -r /auto_mnt/shared/current_projects/jusentari-website/build/* root@137.184.186.45:/var/www/jusentari
	
