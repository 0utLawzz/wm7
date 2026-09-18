export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_assignments: {
        Row: {
          agent_name: string
          application_id: string
          assigned_at: string
          created_by: string | null
          id: string
          notes: string | null
          responded_at: string | null
          response_status: string
          trademark_id: string | null
          updated_at: string
        }
        Insert: {
          agent_name: string
          application_id: string
          assigned_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          responded_at?: string | null
          response_status?: string
          trademark_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string
          application_id?: string
          assigned_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          responded_at?: string | null
          response_status?: string
          trademark_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_assignments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_address: string | null
          applicant_name: string | null
          applicant_type: string | null
          application_name: string | null
          attorney_id: string | null
          case_number: string | null
          city: string | null
          class: string[] | null
          client_id: string
          condition: string | null
          created_at: string
          current_stage: number
          folder_number: string
          id: string
          is_complete: boolean
          is_prolonged: boolean
          last_operation_date: string | null
          logo_url: string | null
          mark_description: string | null
          prefix: string | null
          service_type: string
          sub_status: string | null
          trademark_number: string | null
          trading_as: string | null
          updated_at: string
        }
        Insert: {
          applicant_address?: string | null
          applicant_name?: string | null
          applicant_type?: string | null
          application_name?: string | null
          attorney_id?: string | null
          case_number?: string | null
          city?: string | null
          class?: string[] | null
          client_id: string
          condition?: string | null
          created_at?: string
          current_stage?: number
          folder_number: string
          id?: string
          is_complete?: boolean
          is_prolonged?: boolean
          last_operation_date?: string | null
          logo_url?: string | null
          mark_description?: string | null
          prefix?: string | null
          service_type?: string
          sub_status?: string | null
          trademark_number?: string | null
          trading_as?: string | null
          updated_at?: string
        }
        Update: {
          applicant_address?: string | null
          applicant_name?: string | null
          applicant_type?: string | null
          application_name?: string | null
          attorney_id?: string | null
          case_number?: string | null
          city?: string | null
          class?: string[] | null
          client_id?: string
          condition?: string | null
          created_at?: string
          current_stage?: number
          folder_number?: string
          id?: string
          is_complete?: boolean
          is_prolonged?: boolean
          last_operation_date?: string | null
          logo_url?: string | null
          mark_description?: string | null
          prefix?: string | null
          service_type?: string
          sub_status?: string | null
          trademark_number?: string | null
          trading_as?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_attorney_id_fkey"
            columns: ["attorney_id"]
            isOneToOne: false
            referencedRelation: "attorneys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          agent_name: string
          application_id: string
          assigned_date: string
          city: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_name: string
          application_id: string
          assigned_date?: string
          city?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_name?: string
          application_id?: string
          assigned_date?: string
          city?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      attorneys: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string
          changed_by: string | null
          id: number
          new_record: Json | null
          old_record: Json | null
          trademark_id: string | null
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by?: string | null
          id?: never
          new_record?: Json | null
          old_record?: Json | null
          trademark_id?: string | null
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string | null
          id?: never
          new_record?: Json | null
          old_record?: Json | null
          trademark_id?: string | null
        }
        Relationships: []
      }
      cases: {
        Row: {
          client_group: string | null
          created_at: string | null
          id: number
          journal_no: string | null
          status: string
          title: string
          tm_no: string | null
          updated_at: string | null
        }
        Insert: {
          client_group?: string | null
          created_at?: string | null
          id?: never
          journal_no?: string | null
          status: string
          title: string
          tm_no?: string | null
          updated_at?: string | null
        }
        Update: {
          client_group?: string | null
          created_at?: string | null
          id?: never
          journal_no?: string | null
          status?: string
          title?: string
          tm_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_group_fkey"
            columns: ["client_group"]
            isOneToOne: false
            referencedRelation: "client_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      client_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          client_code: number
          client_name: string
          client_prefix: string
          created_at: string
          id: string
          trading_as: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_code: number
          client_name: string
          client_prefix?: string
          created_at?: string
          id?: string
          trading_as?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          client_code?: number
          client_name?: string
          client_prefix?: string
          created_at?: string
          id?: string
          trading_as?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ipo_entries: {
        Row: {
          application_name: string | null
          class: string | null
          created_at: string
          entry_date: string | null
          id: string
          notes: string | null
          status: string | null
          trademark_number: string | null
          updated_at: string
        }
        Insert: {
          application_name?: string | null
          class?: string | null
          created_at?: string
          entry_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Update: {
          application_name?: string | null
          class?: string | null
          created_at?: string
          entry_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          application_name: string | null
          class: string | null
          created_at: string
          id: string
          journal_date: string | null
          journal_no: string | null
          notes: string | null
          trademark_number: string | null
          updated_at: string
        }
        Insert: {
          application_name?: string | null
          class?: string | null
          created_at?: string
          id?: string
          journal_date?: string | null
          journal_no?: string | null
          notes?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Update: {
          application_name?: string | null
          class?: string | null
          created_at?: string
          id?: string
          journal_date?: string | null
          journal_no?: string | null
          notes?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_publications: {
        Row: {
          agent_name_address: string | null
          applicant_name_address: string | null
          application_no: string | null
          class: string | null
          created_at: string
          filing_date: string | null
          id: string
          journal_no: string
          publication_date: string
          source_file: string | null
          title: string | null
          trademark_number: string | null
          updated_at: string
        }
        Insert: {
          agent_name_address?: string | null
          applicant_name_address?: string | null
          application_no?: string | null
          class?: string | null
          created_at?: string
          filing_date?: string | null
          id?: string
          journal_no: string
          publication_date: string
          source_file?: string | null
          title?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Update: {
          agent_name_address?: string | null
          applicant_name_address?: string | null
          application_no?: string | null
          class?: string | null
          created_at?: string
          filing_date?: string | null
          id?: string
          journal_no?: string
          publication_date?: string
          source_file?: string | null
          title?: string | null
          trademark_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      related_form_entries: {
        Row: {
          agent_name: string | null
          applicant_name: string | null
          application_name: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          filing_date: string | null
          form_code: string
          form_date: string | null
          form_number: string | null
          id: string
          image_path: string | null
          nice_class: string | null
          notes: string | null
          status: string | null
          target_tm_number: string | null
          tm_cpr_number: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agent_name?: string | null
          applicant_name?: string | null
          application_name?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          filing_date?: string | null
          form_code: string
          form_date?: string | null
          form_number?: string | null
          id?: string
          image_path?: string | null
          nice_class?: string | null
          notes?: string | null
          status?: string | null
          target_tm_number?: string | null
          tm_cpr_number: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agent_name?: string | null
          applicant_name?: string | null
          application_name?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          filing_date?: string | null
          form_code?: string
          form_date?: string | null
          form_number?: string | null
          id?: string
          image_path?: string | null
          nice_class?: string | null
          notes?: string | null
          status?: string | null
          target_tm_number?: string | null
          tm_cpr_number?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      stage_payments: {
        Row: {
          amount: number | null
          application_id: string
          created_at: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_status: string
          stage: number
          updated_at: string
        }
        Insert: {
          amount?: number | null
          application_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          stage: number
          updated_at?: string
        }
        Update: {
          amount?: number | null
          application_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          stage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_updates: {
        Row: {
          application_id: string
          created_at: string
          created_by: string | null
          file_url: string | null
          hearing_date: string | null
          id: string
          journal_no: string | null
          notes: string | null
          stage: number
          status: string
          tcs_tracking: string | null
          update_date: string
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          hearing_date?: string | null
          id?: string
          journal_no?: string | null
          notes?: string | null
          stage: number
          status: string
          tcs_tracking?: string | null
          update_date?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          hearing_date?: string | null
          id?: string
          journal_no?: string | null
          notes?: string | null
          stage?: number
          status?: string
          tcs_tracking?: string | null
          update_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_updates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      trademark_stage_events: {
        Row: {
          application_id: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          expected_days: number | null
          id: string
          notes: string | null
          outcome: string | null
          stage: number
          started_at: string
          sub_status: string | null
          trademark_id: string | null
        }
        Insert: {
          application_id: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_days?: number | null
          id?: string
          notes?: string | null
          outcome?: string | null
          stage: number
          started_at?: string
          sub_status?: string | null
          trademark_id?: string | null
        }
        Update: {
          application_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_days?: number | null
          id?: string
          notes?: string | null
          outcome?: string | null
          stage?: number
          started_at?: string
          sub_status?: string | null
          trademark_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trademark_stage_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      trademarks: {
        Row: {
          agent: string | null
          application_name: string | null
          case_number: string | null
          case_type: string | null
          city: string | null
          client_code: string | null
          client_name: string | null
          condition: string
          created_at: string
          created_by: string | null
          filing_date: string | null
          folder_number: string | null
          id: string
          is_prolonged: boolean
          journal_data: Json | null
          journal_date: string | null
          journal_notes: string | null
          journal_number: string | null
          journal_opposition_deadline: string | null
          journal_published: boolean | null
          journal_source: string | null
          journal_submission_date: string | null
          legacy_image_url: string | null
          logo_path: string | null
          nice_class: string | null
          notes: string | null
          prefix: string
          source_sheet_row: number | null
          status: string | null
          sub_status: string | null
          tm_cpr_number: string | null
          tm11: boolean
          tm11_amount: number | null
          tm11_date: string | null
          tm11_notes: string | null
          tm11_received_date: string | null
          tm11_registration_date: string | null
          tm11_submitted_date: string | null
          tm16: boolean
          tm16_notes: string | null
          tm16_reason: string | null
          tm16_received_date: string | null
          tm16_request_date: string | null
          tm16_submitted_date: string | null
          tm5: boolean
          tm5_filed_date: string | null
          tm5_notes: string | null
          tm5_opponent: string | null
          tm5_opposition_no: string | null
          tm56: boolean
          tm56_new_address: string | null
          tm56_notes: string | null
          tm56_old_address: string | null
          tm56_received_date: string | null
          tm56_request_date: string | null
          tm56_submitted_date: string | null
          tm6: boolean
          tm6_counterstatement_no: string | null
          tm6_due_date: string | null
          tm6_filed_date: string | null
          tm6_notes: string | null
          tm6_received_date: string | null
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          agent?: string | null
          application_name?: string | null
          case_number?: string | null
          case_type?: string | null
          city?: string | null
          client_code?: string | null
          client_name?: string | null
          condition?: string
          created_at?: string
          created_by?: string | null
          filing_date?: string | null
          folder_number?: string | null
          id: string
          is_prolonged?: boolean
          journal_data?: Json | null
          journal_date?: string | null
          journal_notes?: string | null
          journal_number?: string | null
          journal_opposition_deadline?: string | null
          journal_published?: boolean | null
          journal_source?: string | null
          journal_submission_date?: string | null
          legacy_image_url?: string | null
          logo_path?: string | null
          nice_class?: string | null
          notes?: string | null
          prefix?: string
          source_sheet_row?: number | null
          status?: string | null
          sub_status?: string | null
          tm_cpr_number?: string | null
          tm11?: boolean
          tm11_amount?: number | null
          tm11_date?: string | null
          tm11_notes?: string | null
          tm11_received_date?: string | null
          tm11_registration_date?: string | null
          tm11_submitted_date?: string | null
          tm16?: boolean
          tm16_notes?: string | null
          tm16_reason?: string | null
          tm16_received_date?: string | null
          tm16_request_date?: string | null
          tm16_submitted_date?: string | null
          tm5?: boolean
          tm5_filed_date?: string | null
          tm5_notes?: string | null
          tm5_opponent?: string | null
          tm5_opposition_no?: string | null
          tm56?: boolean
          tm56_new_address?: string | null
          tm56_notes?: string | null
          tm56_old_address?: string | null
          tm56_received_date?: string | null
          tm56_request_date?: string | null
          tm56_submitted_date?: string | null
          tm6?: boolean
          tm6_counterstatement_no?: string | null
          tm6_due_date?: string | null
          tm6_filed_date?: string | null
          tm6_notes?: string | null
          tm6_received_date?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          agent?: string | null
          application_name?: string | null
          case_number?: string | null
          case_type?: string | null
          city?: string | null
          client_code?: string | null
          client_name?: string | null
          condition?: string
          created_at?: string
          created_by?: string | null
          filing_date?: string | null
          folder_number?: string | null
          id?: string
          is_prolonged?: boolean
          journal_data?: Json | null
          journal_date?: string | null
          journal_notes?: string | null
          journal_number?: string | null
          journal_opposition_deadline?: string | null
          journal_published?: boolean | null
          journal_source?: string | null
          journal_submission_date?: string | null
          legacy_image_url?: string | null
          logo_path?: string | null
          nice_class?: string | null
          notes?: string | null
          prefix?: string
          source_sheet_row?: number | null
          status?: string | null
          sub_status?: string | null
          tm_cpr_number?: string | null
          tm11?: boolean
          tm11_amount?: number | null
          tm11_date?: string | null
          tm11_notes?: string | null
          tm11_received_date?: string | null
          tm11_registration_date?: string | null
          tm11_submitted_date?: string | null
          tm16?: boolean
          tm16_notes?: string | null
          tm16_reason?: string | null
          tm16_received_date?: string | null
          tm16_request_date?: string | null
          tm16_submitted_date?: string | null
          tm5?: boolean
          tm5_filed_date?: string | null
          tm5_notes?: string | null
          tm5_opponent?: string | null
          tm5_opposition_no?: string | null
          tm56?: boolean
          tm56_new_address?: string | null
          tm56_notes?: string | null
          tm56_old_address?: string | null
          tm56_received_date?: string | null
          tm56_request_date?: string | null
          tm56_submitted_date?: string | null
          tm6?: boolean
          tm6_counterstatement_no?: string | null
          tm6_due_date?: string | null
          tm6_filed_date?: string | null
          tm6_notes?: string | null
          tm6_received_date?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      brandex_dashboard_summary: { Args: never; Returns: Json }
      brandex_public_search: {
        Args: { p_tm_number: string }
        Returns: {
          application_name: string
          condition: string
          current_stage: number
          filing_date: string
          journal_date: string
          journal_number: string
          status: string
          sub_status: string
          tm_cpr_number: string
        }[]
      }
      brandex_record_history: {
        Args: { p_trademark_id: string }
        Returns: Json
      }
      generate_folder_number: { Args: { p_client_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "viewer"],
    },
  },
} as const
