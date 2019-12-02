use std::io;
use std::sync::mpsc;
use std::sync::mpsc::Receiver;
use std::sync::mpsc::TryRecvError;
use std::{thread, time};
use std::os::unix::net::UnixStream;
use std::io::Write;
use std::io::Read;
use log::{debug};
use std::time::Duration;

fn setup_logger() -> Result<(), fern::InitError> {
    fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                "{}[{}][{}] {}",
                chrono::Local::now().format("[%Y-%m-%d][%H:%M:%S]"),
                record.target(),
                record.level(),
                message
            ))
        })
        .level(log::LevelFilter::Debug)
        .chain(fern::log_file("/Users/leodt/output.log")?)
        .apply()?;
    Ok(())
}

fn main() {
  setup_logger();

  debug!("running");
  let receive_channel = spawn_receive_channel();
  loop {
    match receive_channel.try_recv() {
      Ok(key) => send_to_native(key),
      Err(TryRecvError::Empty) => debug!("try recv error empty"),
      Err(TryRecvError::Disconnected) => debug!("try recv error disconnected"),
    }
    sleep(1000);
  }
}

fn spawn_receive_channel() -> Receiver<String> {
  let (tx, rx) = mpsc::channel::<String>();

  thread::spawn(move || loop {
    let mut stdin = io::stdin();
    let mut length_bytes = [0; 4];
    stdin.read_exact(&mut length_bytes).unwrap();

    let len = u32::from_le_bytes(length_bytes) as usize;

    if len > 0 {
      let mut buffer = vec![0; len];
      stdin.read_exact(&mut buffer).unwrap();
      let string = String::from_utf8(buffer).unwrap();
      tx.send(string).unwrap();
    }
  });
  rx
}

fn sleep(millis: u64) {
    let duration = time::Duration::from_millis(millis);
    thread::sleep(duration);
}

fn send_to_chrome(msg: String) {
  let mut stdout = io::stdout();
  let length_bytes = msg.len() as u32;

  stdout.write(&length_bytes.to_le_bytes());
  stdout.write(msg.as_bytes());
  stdout.flush();
}

fn send_to_native(msg: String) {
  debug!("send to native: {}", msg);
  let mut stream = UnixStream::connect("/tmp/scrapee.sock").unwrap();

  stream.write_all(msg.as_bytes()).unwrap();
  stream.flush();

  debug!("sended");

  stream.set_read_timeout(Some(Duration::from_millis(1500))).unwrap();

  let mut response = String::new();
  match stream.read_to_string(&mut response) {
    Ok(_) => {
      debug!("response {:?}", response);
      send_to_chrome(response);
    },
    Err(_) => {
      debug!("response timeout");
      send_to_chrome(String::from("{}"));
    }
  };
}