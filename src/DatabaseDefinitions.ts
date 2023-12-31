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
      degrees: {
        Row: {
          color: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      fees: {
        Row: {
          created_at: string | null
          fk_fee_type_id: number | null
          fk_person_id: number | null
          id: number
          payment_date: string
        }
        Insert: {
          created_at?: string | null
          fk_fee_type_id?: number | null
          fk_person_id?: number | null
          id?: number
          payment_date?: string
        }
        Update: {
          created_at?: string | null
          fk_fee_type_id?: number | null
          fk_person_id?: number | null
          id?: number
          payment_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_fk_fee_type_id_fkey"
            columns: ["fk_fee_type_id"]
            isOneToOne: false
            referencedRelation: "fees_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_fk_person_id_fkey"
            columns: ["fk_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          }
        ]
      }
      fees_types: {
        Row: {
          amount: number | null
          count_finance: boolean
          created_at: string | null
          fk_small_group_id: number | null
          fk_team_id: number
          id: number
          is_formal: boolean
          name: string
          start_date: string
        }
        Insert: {
          amount?: number | null
          count_finance?: boolean
          created_at?: string | null
          fk_small_group_id?: number | null
          fk_team_id?: number
          id?: number
          is_formal?: boolean
          name: string
          start_date?: string
        }
        Update: {
          amount?: number | null
          count_finance?: boolean
          created_at?: string | null
          fk_small_group_id?: number | null
          fk_team_id?: number
          id?: number
          is_formal?: boolean
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_types_fk_small_group_id_fkey"
            columns: ["fk_small_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_types_fk_team_id_fkey"
            columns: ["fk_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      finance_categories: {
        Row: {
          color: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      finance_history: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string | null
          fk_category_id: number | null
          fk_fee: number | null
          fk_team_id: number
          id: number
          invoice_number: string | null
          name: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description?: string | null
          fk_category_id?: number | null
          fk_fee?: number | null
          fk_team_id?: number
          id?: number
          invoice_number?: string | null
          name: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string | null
          fk_category_id?: number | null
          fk_fee?: number | null
          fk_team_id?: number
          id?: number
          invoice_number?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_history_fk_category_id_fkey"
            columns: ["fk_category_id"]
            isOneToOne: false
            referencedRelation: "finance_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_history_fk_fee_fkey"
            columns: ["fk_fee"]
            isOneToOne: true
            referencedRelation: "fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_history_fk_team_id_fkey"
            columns: ["fk_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      group_person: {
        Row: {
          created_at: string | null
          fk_person_id: number
          fk_small_group_id: number
          id: number
        }
        Insert: {
          created_at?: string | null
          fk_person_id: number
          fk_small_group_id: number
          id?: number
        }
        Update: {
          created_at?: string | null
          fk_person_id?: number
          fk_small_group_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_person_fk_person_id_fkey"
            columns: ["fk_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_person_fk_small_group_id_fkey"
            columns: ["fk_small_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      people: {
        Row: {
          address: string | null
          admin_since: string | null
          created_at: string | null
          fk_creator_id: string | null
          fk_degree_id: number | null
          fk_role_id: number | null
          fk_small_group_id: number | null
          fk_team_id: number
          fk_user_id: string | null
          id: number
          join_year: string | null
          name: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          pesel: string | null
        }
        Insert: {
          address?: string | null
          admin_since?: string | null
          created_at?: string | null
          fk_creator_id?: string | null
          fk_degree_id?: number | null
          fk_role_id?: number | null
          fk_small_group_id?: number | null
          fk_team_id?: number
          fk_user_id?: string | null
          id?: number
          join_year?: string | null
          name: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          pesel?: string | null
        }
        Update: {
          address?: string | null
          admin_since?: string | null
          created_at?: string | null
          fk_creator_id?: string | null
          fk_degree_id?: number | null
          fk_role_id?: number | null
          fk_small_group_id?: number | null
          fk_team_id?: number
          fk_user_id?: string | null
          id?: number
          join_year?: string | null
          name?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          pesel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_fk_degree_id_fkey"
            columns: ["fk_degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_fk_role_id_fkey"
            columns: ["fk_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_fk_small_group_id_fkey"
            columns: ["fk_small_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_fk_team_id_fkey"
            columns: ["fk_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_fk_user_id_fkey"
            columns: ["fk_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          color: string
          created_at: string
          id: number
          is_admin: boolean
          is_leader: boolean
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: number
          is_admin?: boolean
          is_leader?: boolean
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          is_admin?: boolean
          is_leader?: boolean
          name?: string
        }
        Relationships: []
      }
      small_groups: {
        Row: {
          created_at: string | null
          description: string | null
          fk_team_id: number
          id: number
          is_formal: boolean
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fk_team_id: number
          id?: number
          is_formal?: boolean
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fk_team_id?: number
          id?: number
          is_formal?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "small_groups_fk_team_id_fkey"
            columns: ["fk_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_finance_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          color: string
          percent: number
          fee: boolean
        }[]
      }
      changefeestatus: {
        Args: {
          fee_type_id: number
          person_id: number
        }
        Returns: undefined
      }
      get_people_fees: {
        Args: {
          _group_id: number
        }
        Returns: {
          people_id: number
          people_name: string
          people_join_year: number
          roles_name: string
          roles_color: string
          small_groups_name: string
          fees_id: number
          fees_payment_date: string
        }[]
      }
      get_person_name_from_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_team_money: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_year:
        | {
            Args: {
              created_at: string
            }
            Returns: string
          }
        | {
            Args: {
              created_at?: string
            }
            Returns: string
          }
      get_year_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_year_earnings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_year_expenses: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_member_of: {
        Args: {
          _user_id: string
          _team_id: number
        }
        Returns: boolean
      }
      is_same_team: {
        Args: {
          _user_id: string
          _person_id: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
