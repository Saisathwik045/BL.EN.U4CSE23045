@echo off
SET PATH=C:\PROGRA~1\nodejs;%PATH%
cd notification_app_be
node node_modules\typescript\bin\tsc
node dist\index.js
