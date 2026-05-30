-- =========================================================================
-- Supabase Schema for Announcements (ข่าวสารและประกาศ)
-- =========================================================================
-- คู่มือการใช้งาน:
-- 1. ไปที่เว็บไซต์ Supabase (https://supabase.com) แล้วสมัคร/สร้างโปรเจกต์ใหม่
-- 2. ไปที่เมนู "SQL Editor" ในแดชบอร์ดด้านซ้าย
-- 3. คลิก "New query" วางโค้ด SQL ด้านล่างนี้ทั้งหมด แล้วกดปุ่ม "Run"
-- 4. จากนั้น คัดลอก Project URL และ API Key (Anon Key) จากเมนู Settings > API มาใส่ในหน้าหลังบ้าน admin.html
-- =========================================================================

-- 1. สร้างตาราง announcements
create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text not null,
  date text not null default 'วันนี้',
  "tagMini" text default 'announcement',
  tags text[] default array[]::text[],
  "linkUrl" text default '',
  "linkText" text default 'คลิกเพื่อดาวน์โหลดภาพ',
  "imageType" text not null default 'svg',
  "imageValue" text not null default '1',
  "svgBadgeText" text default 'CLOUD PHOTO DRIVE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. เปิดใช้งาน Row Level Security (RLS)
alter table announcements enable row level security;

-- 3. สร้างนโยบายความปลอดภัย (Policies)
-- อนุญาตให้บุคคลทั่วไปดึงข้อมูลประกาศได้ทั้งหมด (Public Read)
create policy "Allow public read access"
  on announcements for select
  using (true);

-- อนุญาตให้ทุกคนสามารถแก้ไข เพิ่ม ลบ ข้อมูลได้ (แบบง่าย)
-- หมายเหตุ: สำหรับเว็บโหวตสภานักเรียนเพื่อความสะดวก สามารถเปิดสิทธิ์ให้แก้ไขผ่านหน้า admin.html ได้ทันที
create policy "Allow public insert access"
  on announcements for insert
  with check (true);

create policy "Allow public update access"
  on announcements for update
  using (true);

create policy "Allow public delete access"
  on announcements for delete
  using (true);
