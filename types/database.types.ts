export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          denomination: 'PCI' | 'BCM' | 'SA' | 'UPC' | 'Custom'
          preset_lingo: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          denomination: 'PCI' | 'BCM' | 'SA' | 'UPC' | 'Custom'
          preset_lingo?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          denomination?: 'PCI' | 'BCM' | 'SA' | 'UPC' | 'Custom'
          preset_lingo?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      bials: {
        Row: {
          id: string
          tenant_id: string
          name: string
          elder_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          elder_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          elder_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bials_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bials_elder_id_fkey"
            columns: ["elder_id"]
            referencedRelation: "members"
            referencedColumns: ["id"]
          }
        ]
      }
      families: {
        Row: {
          id: string
          bial_id: string | null
          head_name: string
          created_at: string
        }
        Insert: {
          id?: string
          bial_id?: string | null
          head_name: string
          created_at?: string
        }
        Update: {
          id?: string
          bial_id?: string | null
          head_name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_bial_id_fkey"
            columns: ["bial_id"]
            referencedRelation: "bials"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          id: string
          tenant_id: string
          family_id: string | null
          full_name: string
          phone: string | null
          role: 'SuperAdmin' | 'CommitteeAdmin' | 'Member'
          created_at: string
          auth_user_id: string | null
        }
        Insert: {
          id?: string
          family_id?: string | null
          full_name: string
          phone?: string | null
          role?: 'SuperAdmin' | 'CommitteeAdmin' | 'Member'
          created_at?: string
          auth_user_id?: string | null
        }
        Update: {
          id?: string
          family_id?: string | null
          full_name?: string
          phone?: string | null
          role?: 'SuperAdmin' | 'CommitteeAdmin' | 'Member'
          created_at?: string
          auth_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          }
        ]
      }
      committees: {
        Row: {
          id: string
          tenant_id: string
          name: string
          budget_total: number | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          budget_total?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          budget_total?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "committees_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          committee_id: string
          file_url: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          committee_id: string
          file_url: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          file_url?: string
          title?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_committee_id_fkey"
            columns: ["committee_id"]
            referencedRelation: "committees"
            referencedColumns: ["id"]
          }
        ]
      }
      ledger_heads: {
        Row: {
          id: string
          tenant_id: string
          name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_heads_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          tenant_id: string
          family_id: string | null
          head_id: string
          amount: number
          description: string | null
          date: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          family_id?: string | null
          head_id: string
          amount: number
          description?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          family_id?: string | null
          head_id: string
          amount?: number
          description?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_head_id_fkey"
            columns: ["head_id"]
            referencedRelation: "ledger_heads"
            referencedColumns: ["id"]
          }
        ]
      }
      ss_classes: {
        Row: {
          id: string
          tenant_id: string
          name: string
          teacher_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          teacher_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          teacher_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ss_students: {
        Row: {
          id: string
          class_id: string
          member_id: string
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          member_id: string
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          member_id?: string
          created_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          id: string
          tenant_id: string
          member_id: string
          content: string
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          member_id: string
          content: string
          is_anonymous?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          member_id?: string
          content?: string
          is_anonymous?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      denomination_enum: 'PCI' | 'BCM' | 'SA' | 'UPC' | 'Custom'
      role_enum: 'SuperAdmin' | 'CommitteeAdmin' | 'Member'
    }
  }
}
