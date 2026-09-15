import { useState } from 'react'
import { AdminLayout, type AdminTab } from '../components/admin/AdminLayout'
import { HolidaysSection } from '../components/admin/HolidaysSection'
import { StaffSection } from '../components/admin/StaffSection'
import { WorkingHoursSection } from '../components/admin/WorkingHoursSection'

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('staff')

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      {tab === 'staff' && <StaffSection />}
      {tab === 'hours' && <WorkingHoursSection />}
      {tab === 'holidays' && <HolidaysSection />}
    </AdminLayout>
  )
}
