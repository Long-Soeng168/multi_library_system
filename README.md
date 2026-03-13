Image Placholder URL :
https://picsum.photos/seed/${index + 100}/600/400
https://picsum.photos/600/400?random=1

# Cambodia-Libraries

# Setup Project

composer install
rm package-lock.json
npm install --force
cp .env.example .env
php artisan key:generate
php artisan migrate
composer run dev

# Init User

php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=UserSeeder

# CRUD table

php artisan make:model Page -m

- Route
- Controller
- Resource


<!-- TODO: update permission in other resource as it got 'user update' all -->
<RecoverItem
deleted_at={item.deleted_at}
recoverPath={`/admin/users/${item.id}/recover`}
permission="user update" <-------
/>



#PDF Viewer Package
npm install @react-pdf-viewer/core @react-pdf-viewer/default-layout
# sihp-library-website
# multi_library_system
