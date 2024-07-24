use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let toggle_i = MenuItem::with_id(app, "toggle", "Toggle", true, None::<&str>)?;
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu1 = Menu::with_items(app, &[&toggle_i, &quit_i])?;
    let _ = TrayIconBuilder::with_id("tray-1")
        .tooltip("Kunkun")
        .icon(app.default_window_icon().unwrap().clone())
        // .menu(&menu1)
        // .menu_on_left_click(true)
        .on_tray_icon_event(move |icon, event: TrayIconEvent| {
            // println!("on tray icon event: {:?}", event);
            match event {
                TrayIconEvent::Click { button_state, .. } => match button_state {
                    MouseButtonState::Up => {
                        let main_win = icon.app_handle().get_webview_window("main");
                        if let Some(main_win) = main_win {
                            if main_win.is_visible().unwrap() {
                                main_win.hide().unwrap();
                            } else {
                                main_win.show().unwrap();
                                main_win.set_focus().unwrap();
                            }
                        }
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .on_menu_event(move |app, event| {
            println!("event: {:?}", event);
            let main_win = app.get_webview_window("main");
            if let Some(main_win) = main_win {
                main_win.show().unwrap();
                main_win.set_focus().unwrap();
            }
        })
        .build(app);

    Ok(())
}
