export interface Donation {
  id: string
  order_number: string
  amount: number
  currency: 'USD' | 'HNL'
  donor_name: string
  donor_email: string
  donor_phone: string | null
  purpose: string
  payment_method: string
  created_at: string
}

export interface DonationFilters {
  purpose?: string
  dateFrom?: string
  dateTo?: string
  donorName?: string
}

export const useDonationsAdmin = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const donations = ref<Donation[]>([])
  const purposes = ref<string[]>([])

  const loadDonations = async (filters?: DonationFilters) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('donations')
        .select('id, order_number, amount, currency, donor_name, donor_email, donor_phone, purpose, payment_method, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (filters?.purpose && filters.purpose !== 'all') {
        query = query.eq('purpose', filters.purpose)
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59')
      }
      if (filters?.donorName) {
        query = query.ilike('donor_name', `%${filters.donorName}%`)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      donations.value = (data || []) as Donation[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const loadPurposes = async () => {
    try {
      const { data } = await supabase
        .from('donations')
        .select('purpose')
        .eq('status', 'completed')

      if (data) {
        const unique = new Set(data.map((d: any) => d.purpose).filter(Boolean))
        purposes.value = Array.from(unique).sort()
      }
    } catch (_e) {
      // silently fail — purposes filter just won't populate
    }
  }

  return { donations, loading, error, purposes, loadDonations, loadPurposes }
}
