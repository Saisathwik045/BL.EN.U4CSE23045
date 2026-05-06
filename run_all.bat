@echo off
SET PATH=%PATH%;C:\PROGRA~1\nodejs

echo === Installing logging_middleware ===
cd logging_middleware
call npm install
call node node_modules\typescript\bin\tsc
cd ..

echo === Installing notification_app_be ===
cd notification_app_be
call npm install
call node node_modules\typescript\bin\tsc
cd ..

echo === Installing notification_app_fe ===
cd notification_app_fe
call npm install
cd ..

echo === All installs done ===
