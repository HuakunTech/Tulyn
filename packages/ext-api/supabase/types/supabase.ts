export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ext_images: {
        Row: {
          created_at: string
          image_path: string
          sha512: string
        }
        Insert: {
          created_at?: string
          image_path: string
          sha512: string
        }
        Update: {
          created_at?: string
          image_path?: string
          sha512?: string
        }
        Relationships: []
      }
      ext_publish: {
        Row: {
          cmd_count: number
          created_at: string
          demo_images: string[]
          downloads: number
          id: number
          identifier: string
          manifest: Json
          name: string
          shasum: string
          size: number
          tarball_path: string
          version: string
        }
        Insert: {
          cmd_count: number
          created_at?: string
          demo_images: string[]
          downloads: number
          id?: number
          identifier: string
          manifest: Json
          name: string
          shasum: string
          size: number
          tarball_path: string
          version: string
        }
        Update: {
          cmd_count?: number
          created_at?: string
          demo_images?: string[]
          downloads?: number
          id?: number
          identifier?: string
          manifest?: Json
          name?: string
          shasum?: string
          size?: number
          tarball_path?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "ext_publish_identifier_fkey"
            columns: ["identifier"]
            isOneToOne: false
            referencedRelation: "extensions"
            referencedColumns: ["identifier"]
          },
        ]
      }
      extensions: {
        Row: {
          created_at: string
          downloads: number
          icon: Json | null
          identifier: string
          long_description: string | null
          name: string
          readme: string | null
          short_description: string
        }
        Insert: {
          created_at?: string
          downloads: number
          icon?: Json | null
          identifier: string
          long_description?: string | null
          name: string
          readme?: string | null
          short_description: string
        }
        Update: {
          created_at?: string
          downloads?: number
          icon?: Json | null
          identifier?: string
          long_description?: string | null
          name?: string
          readme?: string | null
          short_description?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
