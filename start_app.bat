@echo off
title eRM Klinik Server
color 0A

echo ========================================================
echo               eRM KLINIK - SERVER STARTER
echo ========================================================
echo.
echo Mohon JANGAN TUTUP jendela ini selama aplikasi digunakan.
echo Anda bisa me-minimize jendela ini (-).
echo.

:: Pindah ke direktori script berada
cd /d "%~dp0"

:: Cek apakah folder build (.next) sudah ada
if not exist ".next" (
    echo [INFO] Build belum ditemukan. Sedang melakukan proses build awal...
    echo [INFO] Proses ini mungkin memakan waktu beberapa menit.
    call npm run build
)

:: Buka browser otomatis setelah 5 detik
timeout /t 5 >nul
start "" "http://localhost:3000"

:: Jalankan server
echo [INFO] Menjalankan server...
echo [INFO] Aplikasi siap digunakan saat muncul "Ready in ... ms"
echo.
call npm start

pause
