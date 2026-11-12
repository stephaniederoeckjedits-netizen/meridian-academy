# MERIDIAN ACADEMY — ENGINEERING SYSTEM MAP

Generated: 2026-11-08 23:57:25
Project Root: C:\Users\Mehra\meridian-academy
Files Indexed: 130

## 1. PROJECT CONFIGURATION

Project: meridian-academy
Version: 0.1.0

### Available Scripts
{
    "dev":  "next dev",
    "build":  "next build",
    "start":  "next start",
    "lint":  "eslint"
}

### Dependencies
{
    "@supabase/ssr":  "^0.12.7",
    "@supabase/supabase-js":  "^2.119.0",
    "next":  "16.3.6",
    "react":  "19.2.8",
    "react-dom":  "19.2.8"
}

### Development Dependencies
{
    "@tailwindcss/postcss":  "^4",
    "@types/node":  "^20",
    "@types/react":  "^19",
    "@types/react-dom":  "^19",
    "eslint":  "^9",
    "eslint-config-next":  "16.3.6",
    "tailwindcss":  "^4",
    "typescript":  "^5"
}

## 2. DIRECTORY STRUCTURE

- app
- app\actions
- app\admin
- app\admin\lessons
- app\api
- app\api\cron
- app\api\cron\news
- app\community
- app\community\[channel]
- app\community\[channel]\[threadId]
- app\community\blog
- app\community\blog\[slug]
- app\community\blog\category
- app\community\blog\category\[slug]
- app\community\channels
- app\community\channels\[channel]
- app\community\groups
- app\community\groups\[slug]
- app\community\leaderboard
- app\community\news
- app\community\success
- app\courses
- app\courses\[slug]
- app\courses\[slug]\lessons
- app\courses\[slug]\lessons\[lessonId]
- app\dashboard
- app\forgot-password
- app\library
- app\library\ebooks
- app\library\ebooks\[slug]
- app\library\ebooks\[slug]\read
- app\library\prompts
- app\library\prompts\[id]
- app\library\vault
- app\library\vault\[id]
- app\login
- app\profile
- app\reset-password
- app\signup
- components
- components\journal
- components\news
- components\social
- components\ui
- lib
- lib\hooks
- lib\news
- lib\supabase
- Meridian_Backup
- public
- seed

## 3. APPLICATION ROUTES

- app\admin\lessons\page.tsx
- app\admin\page.tsx
- app\api\cron\news\route.ts
- app\community\[channel]\[threadId]\page.tsx
- app\community\[channel]\page.tsx
- app\community\blog\[slug]\page.tsx
- app\community\blog\category\[slug]\page.tsx
- app\community\blog\page.tsx
- app\community\channels\[channel]\page.tsx
- app\community\channels\page.tsx
- app\community\groups\[slug]\page.tsx
- app\community\groups\page.tsx
- app\community\leaderboard\page.tsx
- app\community\news\page.tsx
- app\community\page.tsx
- app\community\success\page.tsx
- app\courses\[slug]\lessons\[lessonId]\page.tsx
- app\courses\[slug]\page.tsx
- app\courses\page.tsx
- app\dashboard\page.tsx
- app\forgot-password\page.tsx
- app\layout.tsx
- app\library\ebooks\[slug]\page.tsx
- app\library\ebooks\[slug]\read\page.tsx
- app\library\ebooks\page.tsx
- app\library\page.tsx
- app\library\prompts\[id]\page.tsx
- app\library\prompts\page.tsx
- app\library\vault\[id]\page.tsx
- app\library\vault\page.tsx
- app\login\page.tsx
- app\page.tsx
- app\profile\page.tsx
- app\reset-password\page.tsx
- app\signup\page.tsx

## 4. SOURCE FILE INDEX


### app\actions\enroll.ts
Lines: 20
L3: import { revalidatePath } from 'next/cache'
L4: import { createClient } from '@/lib/supabase/server'
L6: export async function enrollInCourse(courseId: string) {

### app\admin\actions.ts
Lines: 168
L5: import { revalidatePath } from 'next/cache'
L6: import { redirect } from 'next/navigation'
L7: import { createClient } from '@/lib/supabase/server'
L23: function refresh() {
L31: export async function createSaga(formData: FormData) {
L45: export async function updateSaga(formData: FormData) {
L59: export async function deleteSaga(formData: FormData) {
L69: export async function createMission(formData: FormData) {
L83: export async function updateMission(formData: FormData) {
L97: export async function deleteMission(formData: FormData) {
L107: export async function createQuest(formData: FormData) {
L132: export async function updateQuest(formData: FormData) {
L145: export async function deleteQuest(formData: FormData) {
L155: export async function createCourse(formData: FormData) {

### app\admin\DeleteButton.tsx
Lines: 33
L5: export default function DeleteButton({

### app\admin\lessons\LessonEditor.tsx
Lines: 77
L3: import { useState } from 'react'
L4: import { useRouter } from 'next/navigation'
L5: import { createClient } from '@/lib/supabase/client'
L7: export default function LessonEditor({

### app\admin\lessons\page.tsx
Lines: 60
L1: import { redirect } from 'next/navigation'
L2: import Link from 'next/link'
L3: import { createClient } from '@/lib/supabase/server'
L4: import LessonEditor from './LessonEditor'
L8: export default async function AdminLessonsPage() {

### app\admin\page.tsx
Lines: 352
L3: import { redirect } from 'next/navigation'
L4: import Link from 'next/link'
L5: import { createClient } from '@/lib/supabase/server'
L6: import AppShell from '@/components/AppShell'
L7: import DeleteButton from './DeleteButton'
L8: import {
L19: export default async function AdminPage() {

### app\api\cron\news\route.ts
Lines: 46
L1: import { NextResponse } from 'next/server'
L2: import { fetchAndStoreNews } from '@/lib/news/fetcher'
L4: export const maxDuration = 60
L6: export async function GET(request: Request) {

### app\community\[channel]\[threadId]\page.tsx
Lines: 0

### app\community\[channel]\[threadId]\ReplyForm.tsx
Lines: 0

### app\community\[channel]\NewThreadForm.tsx
Lines: 0

### app\community\[channel]\page.tsx
Lines: 0

### app\community\blog\[slug]\page.tsx
Lines: 0

### app\community\blog\category\[slug]\page.tsx
Lines: 0

### app\community\blog\page.tsx
Lines: 202
L1: import Link from 'next/link'
L2: import { createClient } from '@/lib/supabase/server'
L3: import AppShell from '@/components/AppShell'
L5: export const revalidate = 0
L7: export default async function BlogPage() {

### app\community\channels\[channel]\page.tsx
Lines: 0

### app\community\channels\page.tsx
Lines: 47
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { createClient } from '@/lib/supabase/server'
L4: import { getCurrentUser } from '@/lib/auth'
L5: import AppShell from '@/components/AppShell'
L6: import ContentArrowNav from '@/components/ContentArrowNav'
L7: import BackLink from '@/components/ui/BackLink'
L11: export default async function ChannelsPage() {

### app\community\groups\[slug]\page.tsx
Lines: 0

### app\community\groups\GroupsClient.tsx
Lines: 53
L2: import { useState } from 'react'
L3: import Link from 'next/link'
L4: import { useRouter } from 'next/navigation'
L5: import { createClient } from '@/lib/supabase/client'
L7: export default function GroupsClient({ groups, userId }: { groups: any[]; userId: string }) {

### app\community\groups\page.tsx
Lines: 23
L1: import { redirect } from 'next/navigation'
L2: import { createClient } from '@/lib/supabase/server'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import AppShell from '@/components/AppShell'
L5: import GroupsClient from './GroupsClient'
L6: import BackLink from '@/components/ui/BackLink'
L8: export const revalidate = 0
L10: export default async function GroupsPage() {

### app\community\leaderboard\page.tsx
Lines: 98
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { createClient } from '@/lib/supabase/server'
L4: import { getCurrentUser } from '@/lib/auth'
L5: import AppShell from '@/components/AppShell'
L6: import BackLink from '@/components/ui/BackLink'
L8: export const revalidate = 0
L11: function getTier(xp: number) {
L20: export default async function LeaderboardPage() {

### app\community\news\page.tsx
Lines: 37
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import AppShell from '@/components/AppShell'
L5: import NewsFeed from '@/components/news/NewsFeed'
L7: export const revalidate = 0
L9: export default async function NewsPage() {

### app\community\page.tsx
Lines: 91
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import { createClient } from '@/lib/supabase/server'
L5: import AppShell from '@/components/AppShell'
L6: import ContentArrowNav from '@/components/ContentArrowNav'
L17: export default async function CommunityPage() {

### app\community\success\page.tsx
Lines: 61
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import AppShell from '@/components/AppShell'
L5: import BackLink from '@/components/ui/BackLink'
L14: export default async function SuccessStoriesPage() {

### app\courses\[slug]\CourseView.tsx
Lines: 0

### app\courses\[slug]\lessons\[lessonId]\CodexContent.tsx
Lines: 0

### app\courses\[slug]\lessons\[lessonId]\CompleteButton.tsx
Lines: 0

### app\courses\[slug]\lessons\[lessonId]\page.tsx
Lines: 0

### app\courses\[slug]\lessons\[lessonId]\QuestPlayer.tsx
Lines: 0

### app\courses\[slug]\lessons\[lessonId]\QuizSection.tsx
Lines: 0

### app\courses\[slug]\page.tsx
Lines: 0

### app\courses\page.tsx
Lines: 134
L1: import Link from 'next/link'
L2: import { redirect } from 'next/navigation'
L3: import { createClient } from '@/lib/supabase/server'
L4: import { getCurrentUser } from '@/lib/auth'
L5: import AppShell from '@/components/AppShell'
L6: import ContentArrowNav from '@/components/ContentArrowNav'
L7: import EnrollButton from '@/app/dashboard/EnrollButton'
L14: export default async function CoursesPage() {

### app\dashboard\EnrollButton.tsx
Lines: 36
L3: import { useState } from 'react'
L4: import { enrollInCourse } from '@/app/actions/enroll'
L6: export default function EnrollButton({

### app\dashboard\page.tsx
Lines: 157
L1: import { redirect } from 'next/navigation'
L2: import Link from 'next/link'
L3: import { createClient } from '@/lib/supabase/server'
L4: import AppShell from '@/components/AppShell'
L5: import DashboardStats from '@/components/DashboardStats'
L6: import DashboardWidgets from '@/components/DashboardWidgets'
L7: import DashboardActivityLog from '@/components/DashboardActivityLog'
L9: export default async function DashboardPage() {

### app\dashboard\SignOutButton.tsx
Lines: 24
L3: import { useRouter } from 'next/navigation'
L4: import { createClient } from '@/lib/supabase/client'
L6: export default function SignOutButton() {

### app\forgot-password\page.tsx
Lines: 89
L5: import { useState } from 'react'
L6: import Link from 'next/link'
L7: import { createClient } from '@/lib/supabase/client'
L9: export default function ForgotPasswordPage() {

### app\layout.tsx
Lines: 26
L2: import type { Metadata } from 'next'
L3: import { Inter } from 'next/font/google'
L4: import './globals.css'
L5: import ThemeProvider from '@/components/ThemeProvider'
L6: import NavLoader from '@/components/NavLoader'
L10: export const metadata: Metadata = {
L15: export default function RootLayout({ children }: { children: React.ReactNode }) {

### app\library\ebooks\[slug]\page.tsx
Lines: 0

### app\library\ebooks\[slug]\read\page.tsx
Lines: 0

### app\library\ebooks\LibraryClient.tsx
Lines: 264
L2: import { useState } from 'react'
L3: import Link from 'next/link'
L4: import { trackResume } from '@/lib/resume'
L6: export default function LibraryClient({ initialBooks, progressMap, latestBook, allProgress }: {

### app\library\ebooks\page.tsx
Lines: 44
L1: import { redirect } from 'next/navigation'
L2: import { createClient } from '@/lib/supabase/server'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import AppShell from '@/components/AppShell'
L5: import LibraryClient from './LibraryClient'
L7: export const dynamic = 'force-dynamic'
L8: export const revalidate = 0
L10: export default async function EbooksPage() {

### app\library\page.tsx
Lines: 112
L1: import Link from 'next/link'
L2: import { createClient } from '@/lib/supabase/server'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import AppShell from '@/components/AppShell'
L6: export default async function LibraryPage() {

### app\library\prompts\[id]\page.tsx
Lines: 0

### app\library\prompts\page.tsx
Lines: 83
L1: import Link from 'next/link'
L2: import { createClient } from '@/lib/supabase/server'
L3: import AppShell from '@/components/AppShell'
L5: export const revalidate = 0
L7: export default async function PromptsPage() {

### app\library\vault\[id]\page.tsx
Lines: 0

### app\library\vault\page.tsx
Lines: 87
L1: import Link from 'next/link'
L2: import { createClient } from '@/lib/supabase/server'
L3: import AppShell from '@/components/AppShell'
L5: export const revalidate = 0
L7: export default async function VaultPage() {

### app\login\page.tsx
Lines: 87
L3: import { useState } from 'react'
L4: import { useRouter } from 'next/navigation'
L5: import Link from 'next/link'
L6: import { createClient } from '@/lib/supabase/client'
L8: export default function LoginPage() {

### app\page.tsx
Lines: 25
L2: import { redirect } from 'next/navigation'
L3: import { getCurrentUser } from '@/lib/auth'
L4: import HomeScreen from '@/components/HomeScreen'
L6: export const dynamic = 'force-dynamic'
L8: export default async function Home() {

### app\profile\page.tsx
Lines: 46
L2: import { redirect } from 'next/navigation'
L3: import { createClient } from '@/lib/supabase/server'
L4: import { getCurrentUser } from '@/lib/auth'
L5: import AppShell from '@/components/AppShell'
L6: import ProfileClient from './ProfileClient'
L8: export default async function ProfilePage() {

### app\profile\ProfileClient.tsx
Lines: 236
L3: import { useState } from 'react'
L4: import { createClient } from '@/lib/supabase/client'
L14: export default function ProfileClient({
L213: function InfoRow({

### app\reset-password\page.tsx
Lines: 108
L5: import { useEffect, useState } from 'react'
L6: import { useRouter } from 'next/navigation'
L7: import Link from 'next/link'
L8: import { createClient } from '@/lib/supabase/client'
L10: export default function ResetPasswordPage() {

### app\signup\page.tsx
Lines: 100
L3: import { useState } from 'react'
L4: import { useRouter } from 'next/navigation'
L5: import Link from 'next/link'
L6: import { createClient } from '@/lib/supabase/client'
L8: export default function SignupPage() {

### components\AcademyBackground.tsx
Lines: 49
L5: export default function AcademyBackground({

### components\AppShell.tsx
Lines: 78
L2: import { useEffect, useState } from 'react'
L3: import Sidebar from './Sidebar'
L4: import MobileNav from './MobileNav'
L5: import ContextSidebar from './ContextSidebar'
L6: import CommandCenter from './CommandCenter'
L7: import AcademyBackground from './AcademyBackground'
L8: import { installZoneTracker } from '@/lib/navZone'
L10: export default function AppShell({

### components\CodexTracker.tsx
Lines: 10
L2: import { useEffect } from 'react'
L3: import { markCodexOpened } from '@/lib/activity'
L5: export default function CodexTracker({ userEmail }: { userEmail?: string }) {

### components\CombatPanel.tsx
Lines: 117
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L23: export default function CombatPanel() {

### components\CommandCenter.tsx
Lines: 417
L3: import { useState, useEffect, useRef } from 'react'
L4: import Link from 'next/link'
L5: import CombatPanel from './CombatPanel'
L26: export default function CommandCenter({ userEmail }: { userEmail?: string }) {

### components\ContentArrowNav.tsx
Lines: 66
L2: import { useEffect, useRef, useState } from 'react'
L3: import { getActiveZone, setActiveZone, onZoneChange } from '@/lib/navZone'
L4: import { unlockAudio, playSelectSound, playConfirmSound } from '@/lib/sounds'
L6: export default function ContentArrowNav({ children }: { children: React.ReactNode }) {
L20: function onKey(e: KeyboardEvent) {

### components\ContextSidebar.tsx
Lines: 166
L2: import { usePathname } from 'next/navigation'
L3: import Link from 'next/link'
L4: import { useState, useEffect } from 'react'
L5: import PomodoroTimer from './PomodoroTimer'
L6: import StudyStreak from './StudyStreak'
L7: import DailyGoal from './DailyGoal'
L8: import QuickNotes from './QuickNotes'
L9: import QuickFlashcard from './QuickFlashcard'
L10: import QuickActions from './QuickActions'
L11: import SyllabusProgress from './SyllabusProgress'
L21: export default function ContextSidebar({ userEmail }: { userEmail?: string }) {

### components\CopyButton.tsx
Lines: 38
L3: import { useState } from 'react'
L5: export default function CopyButton({ text }: { text: string }) {

### components\DailyGoal.tsx
Lines: 121
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L4: import { hasFlag, getPracticeMinutes } from '@/lib/activity'
L15: export default function DailyGoal({ userEmail }: { userEmail?: string }) {

### components\DashboardActivityLog.tsx
Lines: 46
L3: import { useState, useEffect } from 'react'
L11: export default function DashboardActivityLog({ userEmail }: { userEmail?: string }) {

### components\DashboardStats.tsx
Lines: 64
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L5: export default function DashboardStats({ xp, combatLevel, initialShards }: { xp: number, combatLevel: number, initialShards: number }) {

### components\DashboardWidgets.tsx
Lines: 66
L2: import { useState, useEffect } from 'react'
L3: import QuickActions from './QuickActions'
L7: export default function DashboardWidgets({ userEmail }: { userEmail?: string }) {
L32: function openTool(section: Tool) {
L36: function openNextObjective() {

### components\DisciplineScreen.tsx
Lines: 92
L3: import { useEffect, useState } from 'react'
L4: import { pickQuote, type DisciplineQuote } from '@/lib/discipline'
L5: import LogoEmblem from './LogoEmblem'
L7: export default function DisciplineScreen({

### components\DynamicResumeMission.tsx
Lines: 59
L2: import { usePathname } from 'next/navigation'
L3: import Link from 'next/link'
L4: import { useEffect, useState, useCallback } from 'react'
L5: import { getResume, ResumeType } from '@/lib/resume'
L7: export default function DynamicResumeMission() {

### components\HomeScreen.tsx
Lines: 297
L3: import { useEffect, useRef, useState } from 'react'
L4: import Link from 'next/link'
L5: import { useRouter } from 'next/navigation'
L6: import AcademyBackground from './AcademyBackground'
L7: import LogoEmblem from './LogoEmblem'
L8: import { triggerNav } from './NavLoader'
L9: import {
L19: function MenuGlyph({ type }: { type: MenuIcon }) {
L30: export default function HomeScreen({
L46: function retryOnGesture() { unlockAudio(); if (!soundPlayedRef.current) { soundPlayedRef.current = true; playInitializingSound(2200) } }
L69: function onGesture() {
L98: function navigateWithLoader(href: string) {
L102: function moveSelection(delta: number) {
L113: function onKey(e: KeyboardEvent) {
L234: function MenuRow({

### components\journal\ArticleBody.tsx
Lines: 93
L12: export default function ArticleBody({ blocks }: { blocks: Block[] }) {

### components\journal\BookmarkButton.tsx
Lines: 51
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L5: export default function BookmarkButton({ articleId }: { articleId: string }) {

### components\journal\ReadingProgress.tsx
Lines: 30
L2: import { useEffect, useState } from 'react'
L4: export default function ReadingProgress() {
L8: function onScroll() {

### components\journal\ReadingProgressTracker.tsx
Lines: 71
L2: import { useEffect, useRef, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L5: export default function ReadingProgressTracker({ articleId, userId }: { articleId: string; userId: string }) {
L30: function onScroll() {

### components\journal\RelatedContent.tsx
Lines: 79
L2: import Link from 'next/link'
L42: export default function RelatedContent({ categorySlug }: { categorySlug?: string }) {

### components\LiveDashboardMissions.tsx
Lines: 69
L3: import { useState, useEffect } from 'react'
L11: export default function LiveDashboardMissions() {

### components\LogoEmblem.tsx
Lines: 34
L4: export default function LogoEmblem({

### components\MobileNav.tsx
Lines: 161
L4: import { useState } from 'react'
L5: import Link from 'next/link'
L6: import { usePathname, useRouter } from 'next/navigation'
L7: import { createClient } from '@/lib/supabase/client'
L8: import DynamicResumeMission from './DynamicResumeMission'
L9: import ThemeToggle from './ThemeToggle'
L10: import LogoEmblem from './LogoEmblem'
L11: import { triggerNav } from './NavLoader'
L21: export default function MobileNav({ userEmail }: { userEmail?: string }) {

### components\NavLoader.tsx
Lines: 185
L2: import { useEffect, useRef, useState } from 'react'
L3: import { usePathname } from 'next/navigation'
L4: import { pickQuote, type DisciplineQuote } from '@/lib/discipline'
L5: import LogoEmblem from './LogoEmblem'
L6: import { unlockAudio, playTransitionSound } from '@/lib/sounds'
L10: export function triggerNav() {
L20: export default function NavLoader() {
L34: function clearProgress() {
L40: function clearFallback() {
L47: function start() {

### components\news\NewsFeed.tsx
Lines: 128
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L27: export default function NewsFeed() {

### components\PomodoroTimer.tsx
Lines: 118
L2: import { useEffect, useRef, useState } from 'react'
L3: import { addPracticeSeconds } from '@/lib/activity'
L13: export default function PomodoroTimer({ userEmail }: { userEmail?: string }) {
L66: function selectType(t: SessionType) {
L69: function toggle() { setRunning((r) => !r) }
L70: function reset() { setRunning(false); setMode('work'); setSeconds(SESSIONS[type].mins * 60) }

### components\QuickActions.tsx
Lines: 71
L2: import Link from 'next/link'
L6: export default function QuickActions() {
L7: function openTool(section: Tool) {

### components\QuickFlashcard.tsx
Lines: 179
L3: import { useCallback, useMemo, useState } from 'react'
L4: import { markFlashcardUsed } from '@/lib/activity'
L51: export default function QuickFlashcard({ userEmail }: { userEmail?: string }) {
L70: function selectCat(c: Cat) {
L76: function flip() {

### components\QuickNotes.tsx
Lines: 80
L2: import { useEffect, useState } from 'react'
L11: export default function QuickNotes({ userEmail }: { userEmail?: string }) {
L47: function clear() {

### components\ResumeTracker.tsx
Lines: 12
L2: import { useEffect } from 'react'
L3: import { trackResume, ResumeType } from '@/lib/resume'
L5: export default function ResumeTracker({ type, id, title, href, progressData }: {

### components\SectionNav.tsx
Lines: 37
L2: import Link from 'next/link'
L3: import { usePathname } from 'next/navigation'
L5: export default function SectionNav() {

### components\SiblingNav.tsx
Lines: 63
L1: import Link from 'next/link'
L15: export default function SiblingNav({ prev, next, basePath, accent = 'cyan' }: SiblingNavProps) {

### components\Sidebar.tsx
Lines: 215
L2: import { useState, useEffect, useRef } from 'react'
L3: import Link from 'next/link'
L4: import { usePathname, useRouter } from 'next/navigation'
L5: import LogoEmblem from './LogoEmblem'
L6: import DynamicResumeMission from './DynamicResumeMission'
L7: import { createClient } from '@/lib/supabase/client'
L8: import { triggerNav } from './NavLoader'
L9: import { unlockAudio, playSelectSound, playConfirmSound } from '@/lib/sounds'
L10: import { getActiveZone, onZoneChange } from '@/lib/navZone'
L20: export default function Sidebar({ userEmail }: { userEmail?: string }) {
L65: function onKey(e: KeyboardEvent) {

### components\SkillTree.tsx
Lines: 103
L3: import { useEffect, useState } from 'react'
L4: import { createClient } from '@/lib/supabase/client'
L24: export default function SkillTree() {

### components\social\CommentsSection.tsx
Lines: 73
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L5: export default function CommentsSection({ articleId, userId, accent = '#f59e0b' }: { articleId: string; userId: string; accent?: string }) {

### components\social\MessageFeed.tsx
Lines: 123
L2: import { useEffect, useRef, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L5: export default function MessageFeed({ channelId, userId, accent }: { channelId: string; userId: string; accent: string }) {

### components\Starfield.tsx
Lines: 44
L4: export default function Starfield() {

### components\StudyStreak.tsx
Lines: 127
L2: import { useEffect, useState } from 'react'
L14: function getTier(days: number) {
L20: export default function StudyStreak({ userEmail }: { userEmail?: string }) {
L29: function buildWeek(streakVal: number, todayDone: boolean) {
L63: function checkIn() {

### components\SyllabusProgress.tsx
Lines: 82
L2: import { useEffect, useState } from 'react'
L3: import { createClient } from '@/lib/supabase/client'
L7: export default function SyllabusProgress({ userEmail }: { userEmail?: string }) {

### components\ThemeProvider.tsx
Lines: 18
L5: import { useEffect } from 'react'
L7: export default function ThemeProvider({

### components\ThemeToggle.tsx
Lines: 51
L5: import { useEffect, useState } from 'react'
L7: export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
L17: function toggle() {

### components\ui\BackLink.tsx
Lines: 26
L1: import Link from 'next/link'
L3: export default function BackLink({ href, label, accent = '#22d3ee' }: { href: string; label: string; accent?: string }) {

### components\ui\CopyButton.tsx
Lines: 21
L2: import { useState } from 'react'
L4: export default function CopyButton({ text }: { text: string }) {

### eslint.config.mjs
Lines: 18
L1: import { defineConfig, globalIgnores } from "eslint/config";
L2: import nextVitals from "eslint-config-next/core-web-vitals";
L3: import nextTs from "eslint-config-next/typescript";
L18: export default eslintConfig;

### lib\activity.ts
Lines: 44
L4: function prefix(userEmail?: string) {
L8: function todayKey() {
L12: export function markCodexOpened(userEmail?: string) {
L18: export function markFlashcardUsed(userEmail?: string) {
L24: export function addPracticeSeconds(seconds: number, userEmail?: string) {
L32: export function getPracticeMinutes(userEmail?: string): number {
L40: export function hasFlag(flag: 'codex' | 'flashcard', userEmail?: string): boolean {

### lib\auth.ts
Lines: 21
L2: import { cache } from 'react'
L3: import { createClient } from './supabase/server'
L5: export const getCurrentUser = cache(async () => {
L11: export const getCurrentProfile = cache(async () => {

### lib\discipline.ts
Lines: 81
L3: export type DisciplineQuote = {
L8: export const DISCIPLINE_QUOTES: DisciplineQuote[] = [
L75: export function pickQuote(seed?: number): DisciplineQuote {

### lib\hooks\useScrollRestoration.ts
Lines: 30
L2: import { useEffect } from 'react'
L3: import { usePathname } from 'next/navigation'
L5: export function useScrollRestoration(containerRef: React.RefObject<HTMLElement | null>) {

### lib\navZone.ts
Lines: 52
L1: export type NavZone = 'sidebar' | 'content'
L8: function getStore(): ZoneStore {
L19: export function getActiveZone(): NavZone {
L23: export function setActiveZone(zone: NavZone) {
L30: export function onZoneChange(cb: (z: NavZone) => void) {
L38: export function installZoneTracker() {
L40: function onClick(e: MouseEvent) {

### lib\news\fetcher.ts
Lines: 171
L1: import { createClient } from '@supabase/supabase-js'
L3: function parseRSS(xml: string) {
L121: export async function fetchAndStoreNews() {

### lib\resume.ts
Lines: 75
L1: import { createClient } from '@/lib/supabase/client'
L3: export type ResumeType = 'course' | 'ebook' | 'spec' | 'vault';
L11: export async function trackResume(
L45: export async function getResume(type: ResumeType) {

### lib\skills.ts
Lines: 22
L1: import { createClient } from '@/lib/supabase/client'
L3: export async function awardSkillXp(skillSlug: string, xpAmount: number, reason: string) {
L16: export async function getCombatLevel(): Promise<number> {

### lib\sounds.ts
Lines: 407
L6: function getStore(): SoundsStore {
L17: function getCtx(): AudioContext | null {
L35: export function unlockAudio() {
L47: export function isAudioUnlocked() {
L52: export function playInitializingSound(durationMs = 2200) {
L122: export function playTransitionSound(durationMs = 1400) {
L169: export function startAmbientHum(): () => void {
L220: export function playTickSound(progress = 0) {
L252: export function playSelectSound() {
L283: export function playConfirmSound() {
L315: export function playPassSound() {
L348: export function playFailSound() {
L378: export function playPageFlipSound() {

### lib\supabase\client.ts
Lines: 8
L1: import { createBrowserClient } from '@supabase/ssr'
L3: export function createClient() {

### lib\supabase\server.ts
Lines: 25
L1: import { createServerClient } from '@supabase/ssr'
L2: import { cookies } from 'next/headers'
L4: export async function createClient() {

### lib\xp.ts
Lines: 42
L1: export interface Level {
L7: export const LEVELS: Level[] = [
L18: export function getLevelData(currentXp: number) {

### next.config.ts
Lines: 12
L1: import type { NextConfig } from 'next'
L12: export default nextConfig

### next-env.d.ts
Lines: 7
L3: import "./.next/types/routes.d.ts";
L4: import "./.next/types/root-params.d.ts";

### postcss.config.mjs
Lines: 7
L7: export default config;

### proxy.ts
Lines: 57
L2: import { NextResponse, type NextRequest } from 'next/server'
L3: import { createServerClient } from '@supabase/ssr'
L5: export async function proxy(request: NextRequest) {
L49: export const config = {

## 5. DATABASE / SUPABASE

- lib\supabase\client.ts
- lib\supabase\server.ts
- Meridian_Backup\schema.sql
- seed\00_nuke_library.sql
- seed\01_rebuild.sql
- seed\02_book1_ch4_6.sql
- seed\02_nuke_extras.sql
- seed\03_saga_1_1_part2.sql
- seed\05_library_features.sql
- seed\06_book1_batch1.sql
- seed\07_book1_batch2.sql
- seed\08_fix_book_colors.sql

## 6. CONFIGURATION FILES

- next.config.ts
- postcss.config.mjs
- README.md
- tsconfig.json
- vercel.json

## 7. ENGINEERING SAFETY RULES

- This document is a structural index, not runtime proof.
- Original source files must be inspected before modification.
- Never replace entire modules without inspecting dependencies.
- Preserve existing functionality unless explicitly authorized.
- Preserve authentication, authorization and RLS policies.
- Do not invent database tables, columns or relationships.
- Request exact source files before engineering changes.
- Prefer minimal, targeted and backward-compatible changes.
- Never expose environment variables, API keys or secrets.
- Environment files and generated folders are excluded.
- No application source files were modified.
