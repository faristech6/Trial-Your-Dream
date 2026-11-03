-- Run this once in the Supabase SQL Editor after creating the auth account.
-- Change the email below if your Super Admin account uses a different address.

do $$
begin
  if to_regclass('public.users') is null or to_regtype('public.user_role') is null then
    raise exception 'The Trial Your Dream schema is not installed. Run supabase/schema.sql first, then run this repair script.';
  end if;
end $$;

insert into public.users (id, name, email, phone, role)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  raw_user_meta_data->>'phone',
  'CUSTOMER'
from auth.users
where not exists (select 1 from public.users profile where profile.id = auth.users.id);

update public.users
set role = 'SUPER_ADMIN',
    updated_at = now()
where email = 'superadmin@trial.com';

-- Confirm the account is ready before returning to /admin/login.
select id, email, role, company_id
from public.users
where email = 'superadmin@trial.com';
